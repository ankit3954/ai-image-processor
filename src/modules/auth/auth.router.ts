import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
// import { validate } from "../../shared/middleware/validate.middleware";
// import { registerSchema, loginSchema } from "./auth.validator";

const router = Router();

router.post("/register", validate(registerSchema),  authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;