import { Router, type Request, type Response } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { getImage, getImages, transformImage, uploadImage } from "./image.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", authenticate, getImages)
router.post("/uploads", authenticate, upload.single("myFile"), uploadImage);
router.post("/:id/transform/", authenticate, transformImage)
router.get("/:id", authenticate, getImage)

export default router;