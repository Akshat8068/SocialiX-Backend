import { Router } from "express"
import authController from "./auth.controller.js"
import { validate, registerSchema, loginSchema } from "./auth.validation.js"
import authMiddleware from "./auth.middleware.js"


const router = Router()

router.post("/register", validate(registerSchema), authController.register)
router.post("/login", validate(loginSchema), authController.login)
router.post("/forgetPassword", authController.forgetPassword)
router.post("/resetPassword", authController.resetPassword)
router.post("/logout", authController.logout)
router.post("/emailVerify", authController.emailVerify)
router.post("/resend", authController.resendEmail)
router.post("/refreshToken", authController.refreshToken)
router.get("/me", authMiddleware, authController.me);

export default router