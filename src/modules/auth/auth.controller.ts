import { type NextFunction, type Request, type Response } from "express";
import * as authService from "./auth.service.js"
import { refreshTokenCookieOptions } from "../../utils/cookie.utils.js";

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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, tokens } = await authService.login(req.body);

    res.cookie("refreshToken", tokens.refreshToken, refreshTokenCookieOptions)

    res.status(201).json({
      success: true,
      message: "Logged In Successfully.",
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
}