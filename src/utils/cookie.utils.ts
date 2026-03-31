import type { CookieOptions } from "express";
import { jwtConfig } from "../config/jwt.config.js";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,                                          // JS cannot read it
  secure: process.env.NODE_ENV === "production",          // HTTPS only in production
  sameSite: "strict",                                     // no cross-site requests
  maxAge: jwtConfig.refresh.expiresIn,                   // 30 days in ms
};