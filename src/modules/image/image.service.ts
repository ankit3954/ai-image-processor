import type { Request, Response } from "express";
import crypto from "crypto";
import path from "path";
import Image from "./image.model.js";
import { transformationEngine } from "../../utils/transformationEngine.utils.js";
import { createPublicUrl, uploadImageInR2 } from "../../config/s3Client.js";


const getUniqueFileName = (originalName: string) => {
    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(originalName);
    const newFileName = `${randomSuffix}${extension}`;

    return newFileName;
}

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;
    console.log(file)
    if (!file) {
        throw { status: 400, message: "No file uploaded" }
    }

    const uniqueFileName = getUniqueFileName(file.originalname)
    const buffer = file.buffer;
    const mimeType = file.mimetype;
    console.log(uniqueFileName)

    await uploadImageInR2(uniqueFileName, buffer, mimeType);
    const publicUrl = createPublicUrl(uniqueFileName);

    const image = await Image.create({
        userId: req.user.userId,
        original: {
            name: file.originalname,
            fileName: uniqueFileName,
            url: publicUrl,
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


export const getImage = async(
    req: Request,
    res: Response
) => {
    const imageId = req.params.id;
    const userId = req.user?.userId;

    const images = await Image.findOne({
        _id: imageId,
        userId: userId
    } as any);

    if(!images){
        throw { status: 404, message: "No Image Found" }
    }

    return images;
}

export const getImages = async(
    req: Request,
    res: Response
) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user?.userId;


    const images = await Image.find({
        userId: userId
    }as any)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);
    


    if(!images){
        throw { status: 404, message: "No Image Found" }
    }

    return images;
}

