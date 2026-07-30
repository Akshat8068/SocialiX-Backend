import {Router} from "express"
import authMiddleware from "../../middlewares/auth.middleware.js"
import { userProfileValidation, validate } from "./user.validations.js"
import userController from "./user.controller.js"
import upload from "../../middlewares/multer.middleware.js"

const router = Router()


router.get("/profile",authMiddleware,userController.getProfile)
router.get("/otherUsers",authMiddleware,userController.getAllUsers)
router.get("/otherUsers/:userId",authMiddleware,userController.getUserProfile)
router.put("/profile",authMiddleware,validate(userProfileValidation),userController.updateProfile)
router.put("/profile-picture",authMiddleware, upload.single("profilePicture") ,userController.updateProfilePicture)
router.delete("/profile-picture",authMiddleware,userController.removeProfilePicture)
export default router