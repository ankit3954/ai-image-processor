import { Router } from "express";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/uploads", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please send file' });
        }
        console.log(req.file);
        res.send('File uploaded!');
    })
});


export default router;