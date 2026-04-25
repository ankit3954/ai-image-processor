import type { NextFunction, Request, Response } from "express";
import { redis } from "../config/redis.js";

export const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;
        const key = `rate_limit${userId}`;
        const limit = 10;
        const expireInSecs = 60;

        const pipeline = redis.pipeline();
        pipeline.incr(key);
        pipeline.ttl(key);


        const results = await pipeline.exec();

        if (!results) {
            throw {status: 500, message: "Redis pipeline failed"}
        }

        const requestCount = results[0]?.[1] as number;
        const ttl = results[1]?.[1] as number;

        if(requestCount === 1){
            await redis.expire(key, expireInSecs);
        }

        if(requestCount > limit){
            throw {
                status: 429,
                message:{
                    error: "Too Many Requests",
                    retryAfter: ttl > 0 ? ttl: expireInSecs
                }
            }
        }

        next();

    } catch (error) {
        console.error("Rate Limiter Error:", error);
        next(error);
    }
} 