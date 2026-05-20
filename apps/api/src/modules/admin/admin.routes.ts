import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/prisma.js";

const adminRouter = Router();

adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(users);
});

adminRouter.patch("/users/:id/ban", async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      refreshSessions: {
        updateMany: {
          where: { revokedAt: null },
          data: { revokedAt: new Date() },
        },
      },
    },
  });
  res.json({ message: "User sessions revoked", userId: user.id });
});

adminRouter.post("/questions", async (req, res) => {
  const schema = z.object({
    skillId: z.string(),
    prompt: z.string().min(5),
    answer: z.string().min(1),
    explanation: z.string().min(5),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    tags: z.array(z.string()).default([]),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid question payload" });
  }

  const question = await prisma.question.create({ data: payload.data });
  res.status(201).json(question);
});

adminRouter.get("/analytics", async (_req, res) => {
  const [users, attempts, events] = await Promise.all([
    prisma.user.count(),
    prisma.questionAttempt.count(),
    prisma.analyticsEvent.count(),
  ]);
  res.json({ users, attempts, analyticsEvents: events });
});

export { adminRouter };
