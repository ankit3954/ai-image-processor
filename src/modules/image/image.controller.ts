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
        const transformedImage = await imageService.transformImage(req, res);
        res.status(201).json({
            success: true,
            message: "File Trasnformed.",
            data: { transformedImage }
        });
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