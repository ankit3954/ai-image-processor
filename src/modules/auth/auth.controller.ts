import { type NextFunction, type Request, type Response } from "express";
import * as authService from "./auth.service.js"

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully. Please log in.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}