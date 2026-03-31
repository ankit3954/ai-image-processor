import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config.js";
import crypto from "node:crypto";

// console.log(process.env.JWT_SECRET)
export const generateAccessToken = (payload: {
    userId: string;
    role: string;
}): string => {
    console.log( jwtConfig.access.secret)
    const accessToken = jwt.sign(
        {
            userId: payload.userId,
            role: payload.role
        },
        jwtConfig.access.secret,
        {
            expiresIn: jwtConfig.access.expiresIn,
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
        })

    return accessToken;
}


export const generateRefreshToken = (): {
    raw: string;
    hashed: string;
    expiresAt: Date;
} => {
    const raw = crypto.randomBytes(64).toString("hex");
    const hashed = crypto.createHash("sha256").update(raw).digest("hex");
    const expiresAt = new Date(Date.now() + jwtConfig.refresh.expiresIn);

    return { raw, hashed, expiresAt };
}