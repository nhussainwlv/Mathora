import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { verifyAccessToken } from "./jwt.js";

type AuthUser = {
  id: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : undefined;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role as UserRole };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function roleGuard(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}
