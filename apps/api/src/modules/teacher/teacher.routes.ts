import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/prisma.js";

const teacherRouter = Router();

teacherRouter.get("/classrooms", async (req, res) => {
  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: req.user!.id },
    include: { enrollments: true, assignments: true },
  });
  res.json(classrooms);
});

teacherRouter.post("/classrooms", async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    keyStage: z.string().min(2),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) return res.status(400).json({ message: "Invalid classroom payload" });

  const classroom = await prisma.classroom.create({
    data: {
      teacherId: req.user!.id,
      name: payload.data.name,
      keyStage: payload.data.keyStage,
    },
  });
  res.status(201).json(classroom);
});

teacherRouter.post("/assignments", async (req, res) => {
  const schema = z.object({
    classroomId: z.string(),
    title: z.string().min(3),
    instructions: z.string().min(10),
    dueAt: z.string().datetime(),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) return res.status(400).json({ message: "Invalid assignment payload" });

  const assignment = await prisma.assignment.create({
    data: {
      classroomId: payload.data.classroomId,
      createdById: req.user!.id,
      title: payload.data.title,
      instructions: payload.data.instructions,
      dueAt: new Date(payload.data.dueAt),
      status: "PUBLISHED",
    },
  });

  res.status(201).json(assignment);
});

teacherRouter.get("/analytics", async (req, res) => {
  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: req.user!.id },
    include: {
      enrollments: {
        include: {
          user: {
            include: { profile: true },
          },
        },
      },
      assignments: {
        include: {
          submissions: true,
        },
      },
    },
  });
  res.json(classrooms);
});

export { teacherRouter };
