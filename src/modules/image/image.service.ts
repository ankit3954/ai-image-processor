import type { Request, Response } from "express";
import Image from "./image.model.js";
import sharp from "sharp";
import path from "path";
import crypto from "crypto";



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
const getNewDerivedFilePath = (originalImageId: String, targetExtension: string) => {
    // Generate a random string to prevent race conditions
    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const timestamp = Date.now();

    // Result: "661cfb3b...-1713084000000-a1b2c3d4.webp"
    const newFileName = `${originalImageId}-${timestamp}-${randomSuffix}${targetExtension}`;
    // Assuming your uploads folder is at the root of your project
    const uploadsDir = path.join(process.cwd(), 'uploads'); // Adjust based on your folder structure
    const newDerivedFilePath = path.join(uploadsDir, newFileName);
    return {
        newDerivedFilePath,
        newFileName
    };
}

export const transformImage = async (
    req: Request,
    res: Response
) => {
    const imageId = req.params?.id as String;
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

    let imagePipeline = sharp(originalImagePath);


    for (const task of transformations) {
        switch (task.type) {
            case 'resize':
                imagePipeline = imagePipeline.resize({
                    width: task.value.width,
                    height: task.value.height
                });
                break;

            case 'crop':
                imagePipeline = imagePipeline.extract({
                    left: task.value.left,
                    top: task.value.top,
                    width: task.value.width,
                    height: task.value.height
                });
                break;

            case 'rotate':
                imagePipeline = imagePipeline.rotate(task.value);
                break;

            case 'format':
                imagePipeline = imagePipeline.toFormat(task.value.type, {
                    quality: task.value.quality || 80
                });
                break;

            case 'filter':
                if (task.value.name === 'grayscale') {
                    imagePipeline = imagePipeline.grayscale();
                } else if (task.value.name === 'sepia') {
                    imagePipeline = imagePipeline.recomb([
                        [0.393, 0.769, 0.189],
                        [0.349, 0.686, 0.168],
                        [0.272, 0.534, 0.131]
                    ]);
                }
                break;

            default:
                console.warn(`Transformation ${task.type} is not supported.`);
        }
    }
    const {newDerivedFilePath, newFileName} = getNewDerivedFilePath(imageId, '.jpeg');
    await imagePipeline.toFile(newDerivedFilePath);

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

