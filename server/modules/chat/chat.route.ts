import { Router } from "express";
import chatController from "./chat.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get("/conversations",authMiddleware,chatController.getUserConversations)
router.get("/messages/:conversationId",authMiddleware,chatController.getConversationMessages)
router.post("/conversation",authMiddleware,chatController.createConversation)
export default router