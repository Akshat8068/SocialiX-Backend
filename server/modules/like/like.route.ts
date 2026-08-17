import { Router } from "express";
import likeController from "./like.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router=Router()

router.post("/:postId",authMiddleware,likeController.like)
router.get("/:postId/users",authMiddleware,likeController.getLikedUser)

export default router