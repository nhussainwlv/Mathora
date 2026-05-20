import { Router } from "express";
import { Difficulty } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../shared/prisma.js";

const learningRouter = Router();

learningRouter.get("/paths", async (_req, res) => {
  const data = await prisma.keyStagePath.findMany({
    include: {
      skills: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });
  res.json(data);
});

learningRouter.get("/topics", async (_req, res) => {
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      topic: true,
      difficulty: true,
      keyStagePath: { select: { keyStage: true, track: true } },
    },
  });
  res.json(skills);
});

learningRouter.get("/flashcards/:skillId", async (req, res) => {
  const data = await prisma.flashcard.findMany({
    where: { skillId: req.params.skillId },
  });
  res.json(data);
});

learningRouter.get("/questions/:skillId", async (req, res) => {
  const data = await prisma.question.findMany({
    where: { skillId: req.params.skillId },
    take: 20,
  });
  res.json(data);
});

const attemptSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1),
  responseTimeMs: z.number().int().positive().max(120000),
});

learningRouter.post("/attempt", async (req, res) => {
  const payload = attemptSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid attempt payload" });
  }

  const question = await prisma.question.findUnique({
    where: { id: payload.data.questionId },
    include: { skill: true },
  });
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const isCorrect = question.answer.trim().toLowerCase() === payload.data.answer.trim().toLowerCase();
  await prisma.questionAttempt.create({
    data: {
      userId: req.user!.id,
      questionId: question.id,
      isCorrect,
      responseTimeMs: payload.data.responseTimeMs,
    },
  });

  const currentProgress = await prisma.studentProgress.findUnique({
    where: { userId_skillId: { userId: req.user!.id, skillId: question.skillId } },
  });

  const newAttempts = (currentProgress?.attemptsCount ?? 0) + 1;
  const priorMastery = currentProgress?.masteryPct ?? 0;
  const delta = isCorrect ? 8 : -4;
  const masteryPct = Math.max(0, Math.min(100, priorMastery + delta));

  await prisma.studentProgress.upsert({
    where: { userId_skillId: { userId: req.user!.id, skillId: question.skillId } },
    update: {
      attemptsCount: newAttempts,
      masteryPct,
      completed: masteryPct >= 85,
      lastStudiedAt: new Date(),
    },
    create: {
      userId: req.user!.id,
      skillId: question.skillId,
      attemptsCount: 1,
      masteryPct: isCorrect ? 8 : 0,
      completed: false,
      lastStudiedAt: new Date(),
    },
  });

  // Gamification rewards are intentionally small per action to keep progression balanced.
  await prisma.profile.update({
    where: { userId: req.user!.id },
    data: {
      xp: { increment: isCorrect ? 10 : 2 },
      coins: { increment: isCorrect ? 4 : 1 },
      studyMinutes: { increment: 1 },
      accuracyPct: masteryPct,
      level: { increment: isCorrect && masteryPct > 0 && masteryPct % 40 === 0 ? 1 : 0 },
    },
  });

  return res.json({
    isCorrect,
    correctAnswer: question.answer,
    explanation: question.explanation,
    updatedMasteryPct: masteryPct,
  });
});

learningRouter.post("/flashcards/session", async (req, res) => {
  const schema = z.object({
    skillId: z.string().min(1),
    mode: z.enum(["timed-recall", "spaced-repetition", "adaptive"]),
    difficulty: z.nativeEnum(Difficulty).optional(),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid flashcard session payload" });
  }

  const cards = await prisma.flashcard.findMany({
    where: {
      skillId: payload.data.skillId,
      difficulty: payload.data.difficulty,
    },
    take: 25,
  });

  return res.json({
    mode: payload.data.mode,
    intervalSeconds: payload.data.mode === "spaced-repetition" ? 30 : 10,
    cards,
  });
});

export { learningRouter };
