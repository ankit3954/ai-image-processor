import { Redis } from "ioredis";

const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(redisURL);

redis.on("connect", () => {
    console.log("Redis Connection Established");
});

redis.on("error", (error) => {
    console.error("Redis Connection Error:", error.message);
});