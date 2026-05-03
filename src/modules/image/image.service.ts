import type { Request, Response } from "express";
import crypto from "crypto";
import path from "path";
import Image from "./image.model.js";
import { createPublicUrl, deleteImageFromR2, uploadImageInR2 } from "../../config/s3Client.js";
import { getChannel } from "../../config/rabbitmq.js";


const getUniqueFileName = (originalName: string) => {
    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(originalName);
    const newFileName = `${randomSuffix}${extension}`;

    return newFileName;
}

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
        throw { status: 400, message: "No file uploaded" }
    }

    const user = req.user;
    if(!user){
        throw { status: 401, message: "Invalid User"}
    }

    const uniqueFileName = getUniqueFileName(file.originalname)
    const { buffer, mimetype } = file;
    console.log(uniqueFileName)

    await uploadImageInR2(uniqueFileName, buffer, mimetype);
    const publicUrl = createPublicUrl(uniqueFileName);

    try {
        const image = await Image.create({
            userId: user.userId,
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
    } catch (error) {
        console.error("DB Save failed, rolling back R2 upload...");
        await deleteImageFromR2(uniqueFileName);
        throw { status: 500, message: "Failed to save image record." };
    }

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
    } as any)

    if (!image) {
        throw { status: 400, message: "Image not found" }
    }

    const transformationString = JSON.stringify(transformations);
    const fingerPrint = crypto.createHash('md5').update(transformationString).digest('hex');

    const existingDerivedImage = image.derivedImages.find(
        (derived) => derived.fingerPrint === fingerPrint
    )

    if(existingDerivedImage){
         console.log("Cache hit! Returning existing R2 URL.");
        return{
           status: "completed", 
            url: existingDerivedImage.url
        }
    }

    image.status = 'pending';
    await image.save();

    const taskPayLoad = {
        originalFileName: image.original.fileName,
        mimetype: image.original.mimetype,
        transformations,
        imageId,
        userId,
        fingerPrint
    };


    const channel = getChannel();
    const queueName = "image_processing_tasks";

    channel.sendToQueue(
        queueName, 
        Buffer.from(JSON.stringify(taskPayLoad))
    );

    return {
        status: "pending",
        jobId: fingerPrint
    };

}


export const getImage = async (
    req: Request,
    res: Response
) => {
    const imageId = req.params.id;
    const userId = req.user?.userId;

    const images = await Image.findOne({
        _id: imageId,
        userId: userId
    } as any);

    if (!images) {
        throw { status: 404, message: "No Image Found" }
    }

    return images;
}

export const getImages = async (
    req: Request,
    res: Response
) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user?.userId;


    const images = await Image.find({
        userId: userId
    } as any)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);



    if (!images) {
        throw { status: 404, message: "No Image Found" }
    }

    return images;
}

