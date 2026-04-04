import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config.js";
import crypto from "node:crypto";
import type { AccessTokenPayload } from "./token.types.js";

// console.log(process.env.JWT_SECRET)
export const generateAccessToken = (payload: {
    userId: string;
    role: string;
}): string => {
    const accessToken = jwt.sign(
        {
            userId: payload.userId,
            role: payload.role
        },
        jwtConfig.access.secret as string,
        {
            expiresIn: jwtConfig.access.expiresIn as any,
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

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(
        token,
        jwtConfig.access.secret,
        {
            algorithms: ['HS256'],
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        }
    ) as AccessTokenPayload;
}