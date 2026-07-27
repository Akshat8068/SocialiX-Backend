import { Router } from "express";
import authController from "../auth/auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import hashTagController from "./hashTag.controller.js";

const router=Router()

router.post("/",authMiddleware,hashTagController.createHashTag)
router.get("/",authMiddleware,hashTagController.getHashTag)
router.delete("/:hashtagId",authMiddleware,hashTagController.deleteHashTag)

export default router