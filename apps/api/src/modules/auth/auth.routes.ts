import { Router } from "express";
import argon2 from "argon2";
import crypto from "node:crypto";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { prisma } from "../../shared/prisma.js";
import { signAccessToken, signRefreshToken } from "../../shared/jwt.js";
import { authGuard } from "../../shared/guards.js";

export const authRouter = Router();

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
});

authRouter.post("/signup", async (req, res) => {
  const payload = signUpSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid signup payload", issues: payload.error.issues });
  }

  const existing = await prisma.user.findUnique({ where: { email: payload.data.email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await argon2.hash(payload.data.password);
  const user = await prisma.user.create({
    data: {
      email: payload.data.email,
      passwordHash,
      role: UserRole.STUDENT,
      profile: {
        create: {
          displayName: payload.data.displayName,
        },
      },
    },
    include: { profile: true },
  });

  const rawVerification = crypto.randomUUID();
  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      tokenHash: await argon2.hash(rawVerification),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return res.status(201).json({
    message: "Account created. Verify your email.",
    verificationTokenForDev: rawVerification,
  });
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/signin", async (req, res) => {
  const payload = signInSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid signin payload" });
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.data.email },
    include: { profile: true },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await argon2.verify(user.passwordHash, payload.data.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: await argon2.hash(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    },
  });

  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    },
  });
});

authRouter.get("/me", authGuard, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { profile: true },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile,
  });
});

authRouter.post("/signout", async (req, res) => {
  const refreshToken = req.body?.refreshToken as string | undefined;
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  const sessions = await prisma.refreshSession.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } },
  });

  for (const session of sessions) {
    const matched = await argon2.verify(session.tokenHash, refreshToken);
    if (matched) {
      await prisma.refreshSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      break;
    }
  }

  return res.json({ message: "Signed out" });
});

authRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.body?.refreshToken as string | undefined;
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  const sessions = await prisma.refreshSession.findMany({
    where: {
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  for (const session of sessions) {
    const valid = await argon2.verify(session.tokenHash, refreshToken);
    if (!valid) continue;

    const accessToken = signAccessToken({ sub: session.userId, role: session.user.role });
    const newRefreshToken = signRefreshToken({ sub: session.userId, role: session.user.role });

    await prisma.refreshSession.update({
      where: { id: session.id },
      data: {
        revokedAt: new Date(),
      },
    });
    await prisma.refreshSession.create({
      data: {
        userId: session.userId,
        tokenHash: await argon2.hash(newRefreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  }

  return res.status(401).json({ message: "Invalid refresh token" });
});

authRouter.post("/verify-email", async (req, res) => {
  const token = req.body?.token as string | undefined;
  if (!token) {
    return res.status(400).json({ message: "Missing token" });
  }

  const candidates = await prisma.verificationToken.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
  });
  for (const candidate of candidates) {
    const matched = await argon2.verify(candidate.tokenHash, token);
    if (matched) {
      await prisma.$transaction([
        prisma.verificationToken.update({
          where: { id: candidate.id },
          data: { usedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: candidate.userId },
          data: { isEmailVerified: true },
        }),
      ]);
      return res.json({ message: "Email verified" });
    }
  }

  return res.status(400).json({ message: "Invalid token" });
});

authRouter.post("/password-reset/request", async (req, res) => {
  const email = req.body?.email as string | undefined;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: "If the email exists, reset instructions were sent." });

  const rawToken = crypto.randomUUID();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: await argon2.hash(rawToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    },
  });

  return res.json({
    message: "Reset token generated for development.",
    resetTokenForDev: rawToken,
  });
});

authRouter.post("/password-reset/confirm", async (req, res) => {
  const token = req.body?.token as string | undefined;
  const password = req.body?.password as string | undefined;
  if (!token || !password) {
    return res.status(400).json({ message: "Token and password required" });
  }

  const candidates = await prisma.passwordResetToken.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
  });

  for (const candidate of candidates) {
    const matched = await argon2.verify(candidate.tokenHash, token);
    if (matched) {
      await prisma.$transaction([
        prisma.passwordResetToken.update({
          where: { id: candidate.id },
          data: { usedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: candidate.userId },
          data: { passwordHash: await argon2.hash(password) },
        }),
      ]);
      return res.json({ message: "Password updated" });
    }
  }

  return res.status(400).json({ message: "Invalid token" });
});

