import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import path from "node:path";

import { env } from "./shared/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { learningRouter } from "./modules/learning/learning.routes.js";
import { teacherRouter } from "./modules/teacher/teacher.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { parentRouter } from "./modules/parent/parent.routes.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { authGuard, roleGuard } from "./shared/guards.js";
import { errorHandler, notFoundHandler } from "./shared/http-errors.js";
import { UserRole } from "@prisma/client";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mathora-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/dashboard", authGuard, dashboardRouter);
app.use("/api/learning", authGuard, learningRouter);
app.use("/api/teacher", authGuard, roleGuard([UserRole.TEACHER, UserRole.ADMIN]), teacherRouter);
app.use("/api/admin", authGuard, roleGuard([UserRole.ADMIN]), adminRouter);
app.use("/api/parent", authGuard, roleGuard([UserRole.PARENT, UserRole.ADMIN]), parentRouter);
app.use("/api/ai", authGuard, aiRouter);

// CSRF protection for state-changing cookie-authenticated routes.
app.use(
  csrf({
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Mathora API running on port ${env.PORT}`);
});
