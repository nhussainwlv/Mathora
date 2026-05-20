import { Router } from "express";
import { prisma } from "../../shared/prisma.js";

const parentRouter = Router();

parentRouter.get("/children", async (req, res) => {
  const links = await prisma.parentStudentLink.findMany({
    where: { parentId: req.user!.id },
    include: {
      student: {
        include: { profile: true },
      },
    },
  });
  res.json(links.map((item) => item.student));
});

parentRouter.get("/children/:studentId/progress", async (req, res) => {
  const studentId = req.params.studentId;
  const [profile, progressRows, attempts] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: studentId } }),
    prisma.studentProgress.findMany({
      where: { userId: studentId },
      include: { skill: true },
    }),
    prisma.questionAttempt.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const accuracy =
    attempts.length === 0
      ? 0
      : (attempts.filter((item) => item.isCorrect).length / attempts.length) * 100;

  res.json({
    profile,
    progressRows,
    accuracy: Number(accuracy.toFixed(1)),
    totalAttempts: attempts.length,
  });
});

export { parentRouter };
