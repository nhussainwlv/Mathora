import { Router } from "express";
import { GameLevel, UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../shared/prisma.js";
import { roleGuard } from "../../shared/guards.js";

export const gamesRouter = Router();

gamesRouter.use(roleGuard([UserRole.STUDENT]));

const recordSchema = z.object({
  gameMode: z.string().min(1).max(64),
  level: z.nativeEnum(GameLevel),
  questionKey: z.string().min(1).max(128),
  prompt: z.string().min(1).max(500),
  userAnswer: z.string().max(200).optional(),
  correctAnswer: z.string().min(1).max(200),
  isCorrect: z.boolean(),
  xpEarned: z.number().int().min(0).max(500).default(0),
  coinsEarned: z.number().int().min(0).max(200).default(0),
});

gamesRouter.get("/progress", async (req, res) => {
  const userId = req.user!.id;

  const [profile, solves, totals] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.gameSolve.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        gameMode: true,
        level: true,
        questionKey: true,
        prompt: true,
        isCorrect: true,
        xpEarned: true,
        coinsEarned: true,
        createdAt: true,
      },
    }),
    prisma.gameSolve.groupBy({
      by: ["gameMode", "level"],
      where: { userId, isCorrect: true },
      _count: { _all: true },
    }),
  ]);

  const solvedKeys = [...new Set(solves.map((s) => s.questionKey))];

  return res.json({
    profile: profile ?? { xp: 0, coins: 0, level: 1, displayName: "Student", streakDays: 0 },
    solvedKeys,
    recentSolves: solves.slice(0, 40),
    stats: {
      totalAttempts: solves.length,
      correctCount: solves.filter((s) => s.isCorrect).length,
      byModeLevel: totals.map((row) => ({
        gameMode: row.gameMode,
        level: row.level,
        correct: row._count._all,
      })),
    },
  });
});

gamesRouter.post("/attempt", async (req, res) => {
  const payload = recordSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid attempt payload", issues: payload.error.issues });
  }

  const userId = req.user!.id;
  const data = payload.data;

  const [solve, profile] = await prisma.$transaction(async (tx) => {
    const created = await tx.gameSolve.create({
      data: {
        userId,
        gameMode: data.gameMode,
        level: data.level,
        questionKey: data.questionKey,
        prompt: data.prompt,
        userAnswer: data.userAnswer ?? null,
        correctAnswer: data.correctAnswer,
        isCorrect: data.isCorrect,
        xpEarned: data.isCorrect ? data.xpEarned : 0,
        coinsEarned: data.isCorrect ? data.coinsEarned : 0,
      },
    });

    let updatedProfile = await tx.profile.findUnique({ where: { userId } });
    if (data.isCorrect && updatedProfile) {
      const xp = updatedProfile.xp + data.xpEarned;
      const coins = updatedProfile.coins + data.coinsEarned;
      const level = Math.max(1, Math.floor(xp / 500) + 1);
      updatedProfile = await tx.profile.update({
        where: { userId },
        data: { xp, coins, level },
      });
    }

    return [created, updatedProfile];
  });

  return res.status(201).json({
    solve: {
      id: solve.id,
      questionKey: solve.questionKey,
      isCorrect: solve.isCorrect,
    },
    profile,
  });
});
