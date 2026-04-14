import type { Request, Response } from "express";
import Image from "./image.model.js";
import { transformationEngine } from "../../utils/transformationEngine.utils.js";


export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;
    console.log(req)
    if (!file) {
        throw { status: 400, message: "No file uploaded" }
    }

    const image = await Image.create({
        userId: req.user.userId,
        original: {
            name: file.originalname,
            fileName: file.filename,
            url: file.path,
            size: file.size,
            mimetype: file.mimetype,
        },
        derivedImages: [],
    })

    return {
        id: image._id,
        url: image.original.url
    };

}

export const transformImage = async (
    req: Request,
    res: Response
) => {
    const imageId = req.params?.id as string;
    const userId = req.user?.userId;
    const transformations = req.body.transformations;

    const image = await Image.findOne({
        _id: imageId,
        userId: userId
    }as any)

    if (!image) {
        throw { status: 400, message: "Image not found" }
    }

    const originalImagePath = image.original.url;

    const { newDerivedFilePath, newFileName } = await transformationEngine(originalImagePath, transformations, imageId);

    image.derivedImages.push({
        url: newDerivedFilePath,
        fileName: newFileName,
        transformations
    });

    await image.save()

    return {
        url: newDerivedFilePath
    }

}

