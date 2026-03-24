import { Router } from "express";
import * as authController from "./auth.controller.js";
// import { validate } from "../../shared/middleware/validate.middleware";
// import { registerSchema, loginSchema } from "./auth.validator";

const router = Router();

router.post("/register",  authController.register);
// router.post("/login", validate(loginSchema), authController.login);

export default router;