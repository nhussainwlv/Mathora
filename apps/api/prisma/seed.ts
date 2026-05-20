import { PrismaClient, Difficulty, UserRole } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("Mathora123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@mathora.academy" },
    update: {},
    create: {
      email: "admin@mathora.academy",
      passwordHash,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      profile: {
        create: {
          displayName: "Mathora Admin",
          rankLabel: "Overseer",
        },
      },
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@mathora.academy" },
    update: {},
    create: {
      email: "teacher@mathora.academy",
      passwordHash,
      role: UserRole.TEACHER,
      isEmailVerified: true,
      profile: {
        create: {
          displayName: "Teacher Taylor",
          keyStage: "KS3",
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@mathora.academy" },
    update: {},
    create: {
      email: "student@mathora.academy",
      passwordHash,
      role: UserRole.STUDENT,
      isEmailVerified: true,
      profile: {
        create: {
          displayName: "Student Sam",
          keyStage: "KS2",
          xp: 245,
          coins: 90,
          level: 4,
          streakDays: 7,
        },
      },
    },
  });

  const curriculum: Record<string, string[]> = {
    KS1: ["Counting", "Addition", "Subtraction", "Shapes", "Time", "Money", "Fractions basics"],
    KS2: ["Multiplication", "Division", "Decimals", "Fractions", "Geometry", "Measurements", "Word problems"],
    KS3: ["Algebra", "Ratios", "Probability", "Graphs", "Angles", "Statistics", "Percentages", "Equations"],
    KS4: [
      "GCSE Foundation Maths",
      "GCSE Higher Maths",
      "Trigonometry",
      "Simultaneous equations",
      "Quadratics",
      "Functions",
      "Vectors",
      "Histograms",
      "Circle theorems",
      "Probability trees",
      "Algebraic fractions",
    ],
  };

  for (const [keyStage, topics] of Object.entries(curriculum)) {
    for (const track of ["Foundation", "Higher"]) {
      const path = await prisma.keyStagePath.upsert({
        where: { id: `${keyStage.toLowerCase()}-${track.toLowerCase()}` },
        update: {},
        create: {
          id: `${keyStage.toLowerCase()}-${track.toLowerCase()}`,
          keyStage,
          track,
          title: `${keyStage} ${track} Learning Path`,
          description: `Progressive ${keyStage} curriculum path for ${track} learners.`,
        },
      });

      for (const [index, topic] of topics.entries()) {
        const skill = await prisma.skill.upsert({
          where: { slug: `${keyStage.toLowerCase()}-${track.toLowerCase()}-${topic.toLowerCase().replace(/\s+/g, "-")}` },
          update: {},
          create: {
            keyStagePathId: path.id,
            name: `${topic} ${track}`,
            slug: `${keyStage.toLowerCase()}-${track.toLowerCase()}-${topic.toLowerCase().replace(/\s+/g, "-")}`,
            topic,
            difficulty:
              index % 3 === 0 ? Difficulty.BEGINNER : index % 3 === 1 ? Difficulty.INTERMEDIATE : Difficulty.ADVANCED,
            orderIndex: index + 1,
            unlockXp: index * 25,
          },
        });

        await prisma.question.create({
          data: {
            skillId: skill.id,
            prompt: `${topic}: solve this practice challenge.`,
            answer: "Sample answer",
            explanation: `Guided explanation for ${topic}.`,
            difficulty: Difficulty.BEGINNER,
            tags: [keyStage.toLowerCase(), topic.toLowerCase()],
          },
        });

        await prisma.flashcard.create({
          data: {
            skillId: skill.id,
            frontText: `${topic} quick recall`,
            backText: `Key concept for ${topic}`,
            hint: `Remember the core rule for ${topic}.`,
            difficulty: Difficulty.BEGINNER,
          },
        });
      }
    }
  }

  await prisma.achievement.upsert({
    where: { code: "STREAK_7" },
    update: {},
    create: {
      code: "STREAK_7",
      name: "7-Day Scholar",
      description: "Maintain a 7 day study streak.",
      xpReward: 50,
      coinReward: 30,
    },
  });

  const classroom = await prisma.classroom.create({
    data: {
      teacherId: teacher.id,
      name: "KS2 Maths Wizards",
      keyStage: "KS2",
      enrollments: {
        create: [{ userId: student.id }],
      },
    },
  });

  await prisma.assignment.create({
    data: {
      classroomId: classroom.id,
      createdById: teacher.id,
      title: "Times Tables Sprint",
      instructions: "Complete 20 multiplication questions before Friday.",
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      status: "PUBLISHED",
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      userId: student.id,
      eventType: "seed.session.completed",
      payloadJson: { minutes: 20, accuracy: 0.85 },
    },
  });

  console.log("Seed completed", { admin: admin.email, teacher: teacher.email, student: student.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
