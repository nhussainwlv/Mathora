import { Router } from "express";
import multer from "multer";
import { prisma } from "../../shared/prisma.js";
import { getRecommendationsForUser } from "../learning/recommendation.service.js";

const dashboardRouter = Router();
const upload = multer({ dest: "uploads/" });

dashboardRouter.get("/me", async (req, res) => {
  const userId = req.user!.id;

  const [profile, achievements, recentAttempts, progressRows] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
      take: 6,
    }),
    prisma.questionAttempt.findMany({
      where: { userId },
      include: { question: { include: { skill: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.studentProgress.findMany({
      where: { userId },
      include: { skill: true },
    }),
  ]);

  const accuracy =
    recentAttempts.length === 0
      ? 0
      : (recentAttempts.filter((item) => item.isCorrect).length / recentAttempts.length) * 100;

  const recommendations = getRecommendationsForUser(progressRows);
  const leaderboard = await prisma.profile.findMany({
    orderBy: { xp: "desc" },
    take: 10,
    select: { displayName: true, xp: true, level: true, rankLabel: true },
  });

  return res.json({
    profile,
    stats: {
      xp: profile?.xp ?? 0,
      level: profile?.level ?? 1,
      streakDays: profile?.streakDays ?? 0,
      accuracyPct: Number(accuracy.toFixed(1)),
      studyMinutes: profile?.studyMinutes ?? 0,
      subjectsCompleted: progressRows.filter((row) => row.completed).length,
    },
    achievements: achievements.map((item) => ({
      code: item.achievement.code,
      name: item.achievement.name,
      earnedAt: item.earnedAt,
    })),
    leaderboard,
    recommendations,
    recentlyPlayedGames: [
      { mode: "Timed Quiz", score: 890, playedAt: new Date().toISOString() },
      { mode: "Flashcard Sprint", score: 760, playedAt: new Date().toISOString() },
    ],
  });
});

dashboardRouter.post("/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar file is required" });
  }

  await prisma.profile.update({
    where: { userId: req.user!.id },
    data: { avatarUrl: `/uploads/${req.file.filename}` },
  });

  return res.json({ message: "Avatar uploaded", avatarUrl: `/uploads/${req.file.filename}` });
});

export { dashboardRouter };
