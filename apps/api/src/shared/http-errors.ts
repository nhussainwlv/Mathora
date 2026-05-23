import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("Unhandled API error:", error);
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong. Please try again.";
  return res.status(500).json({ message });
}
