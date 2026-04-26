import { Router, type Request, type Response } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { getImage, getImages, transformImage, uploadImage } from "./image.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import { validate } from "../../middlewares/validator.middleware.js";
import { transformPayloadSchema } from "./image.validator.js";

const router = Router();

router.get("/", authenticate, getImages)
router.post("/uploads", authenticate, upload.single("myFile"), uploadImage);
router.post("/:id/transform/", authenticate, validate(transformPayloadSchema) ,rateLimiter ,transformImage)
router.get("/:id", authenticate, getImage)

export default router;