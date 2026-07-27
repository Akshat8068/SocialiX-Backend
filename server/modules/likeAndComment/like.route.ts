import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import likeController from "./like.controller.js";

const router=Router()

router.post("/:postId",authMiddleware,likeController.like)
router.get("/:postId/users",authMiddleware,likeController.getLikedUser)

export default router