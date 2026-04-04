import { Router, type Request, type Response } from "express";
import upload from "../../middlewares/upload.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const router = Router();

router.post("/uploads", authenticate , (req: Request, res: Response) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please send file' });
        }

        res.status(201).json({
            success: true,
            message: "File Uploaded.",
            data: {},
        });
    })
});

export default router;