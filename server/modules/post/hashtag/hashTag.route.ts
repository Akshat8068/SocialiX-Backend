import { Router } from "express";
import hashTagController from "./hashTag.controller.js";
import authMiddleware from "../../auth/auth.middleware.js";

const router=Router()

router.post("/",authMiddleware,hashTagController.createHashTag)
router.get("/name",authMiddleware,hashTagController.getHashTag)
router.get("/",authMiddleware,hashTagController.getAllHashtags)
router.delete("/:hashtagId",authMiddleware,hashTagController.deleteHashTag)

export default router