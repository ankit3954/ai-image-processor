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
            data: { image }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const transformImage = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await imageService.transformImage(req, res);
        
        if (result.status === "completed") {
            res.status(200).json({
                success: true,
                message: "Image fetched from cache.",
                data: result
            });
        } else {
            res.status(202).json({
                success: true,
                message: "Image transformation accepted and is processing.",
                data: result
            });
        }
    } catch (err) {
        console.error(err)
        next(err)
    }
}


export const getImage = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const image = await imageService.getImage(req, res);
        res.status(201).json({
            success: true,
            message: "Image Found Successfully",
            data: { image }
        });
    } catch (err) {
        console.error(err)
        next(err)
    }
}

export const getImages = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const images = await imageService.getImages(req, res);
        res.status(201).json({
            success: true,
            message: "Images Found Successfully",
            data: { images }
        });
    } catch (err) {
        console.error(err)
        next(err)
    }
}