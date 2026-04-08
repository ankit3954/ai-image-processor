import { type NextFunction, type Request, type Response } from "express";
import * as imageService from "./image.service.js"

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const image = await imageService.uploadImage(req, res);

        res.status(201).json({
            success: true,
            message: "File Uploaded.",
            data: {image}
        });
    } catch (err) {
        next(err);
    }
}