import { Router } from "express";
import savedController from "./saved.contoller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router=Router()

router.post("/:postId",authMiddleware,savedController.savedPost)
router.get("/:postId",authMiddleware,savedController.getSingleSaved)
router.get("/",authMiddleware,savedController.getAllSaved)

export default router