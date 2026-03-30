import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (status === 500 && process.env.NODE_ENV === "production") {
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }

  res.status(status).json({ success: false, message });
}