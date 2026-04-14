import { Router, type Request, type Response } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { transformImage, uploadImage } from "./image.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/uploads", authenticate, upload.single("myFile"), uploadImage);
router.post("/:id/transform/", authenticate, transformImage)


export default router;