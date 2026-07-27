import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import commentController from "./comment.contoller.js";

const router=Router()

router.post("/:postId",authMiddleware,commentController.createComment)
router.post("/reply/:commentId",authMiddleware,commentController.replyComment)
router.put("/:commentId",authMiddleware,commentController.updateComment)
router.delete("/:commentId",authMiddleware,commentController.deleteComment)
router.get("/:postId",authMiddleware,commentController.getPostComments)


export default router