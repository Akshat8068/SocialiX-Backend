import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import savedController from "./saved.contoller.js";

const router=Router()

router.post("/:postId",authMiddleware,savedController.savedPost)
router.get("/:postId",authMiddleware,savedController.getSingleSaved)
router.get("/",authMiddleware,savedController.getAllSaved)

export default router