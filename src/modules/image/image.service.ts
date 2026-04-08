import type { Request, Response } from "express";
import upload from "../../middlewares/upload.middleware.js";
import Image from "./image.model.js";



export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        throw { status: 400, message: "No file uploaded" }
    }
    console.log(req.file)
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

