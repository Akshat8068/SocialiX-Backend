import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import chatController from "./chat.controller.js";

const router = Router();

router.get("/conversations",authMiddleware,chatController.getUserConversations)
router.get("/messages/:conversationId",authMiddleware,chatController.getConversationMessages)
router.post("/conversation",authMiddleware,chatController.createConversation)
export default router