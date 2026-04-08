import { Router, type Request, type Response } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { uploadImage } from "./image.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/uploads", authenticate, upload.single('myFile'), uploadImage);

export default router;