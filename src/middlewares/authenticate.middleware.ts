import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../token/token.service.js";
import { User } from "../modules/user/user.model.js";

export const authenticate = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            throw {status: 401, message: "No token provided"}
        }

        const parts = authHeader.split(" ");
        if(parts.length !== 2 || parts[0] !== "Bearer"){
             throw {status: 401, message: "Invaled token format"}
        }

        const token = parts[1] as string;
        const payload = verifyAccessToken(token);

        const user = await User.findOne({
            _id: payload.userId
        }).select("isActive")

        if(!user){
            throw {status: 401, message: "User no longer exist"}
        }

        if(!user.isActive){
             throw {status: 403, message: "Account is not accessible"}
        }

        req.user = {
            userId: payload.userId,
            role: payload.role
        }

        next()
    } catch (error) {
        next(error)
    }
}