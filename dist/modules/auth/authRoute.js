import { Router } from "express";
import authController from "./authController.js";
const router = Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/logout", authController.logout);
router.post("/emailVerify", authController.emailVerify);
router.post("/resend", authController.resendEmail);
router.post("/refreshToken", authController.refreshToken);
export default router;
//# sourceMappingURL=authRoute.js.map