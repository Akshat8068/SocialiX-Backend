import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import notificationController from "./notification.controller.js";

const router = Router()

router.get("/",authMiddleware,notificationController.getNotifications)
router.get("/unread-count",authMiddleware,notificationController.getUnreadCount)
router.put("/read-all",authMiddleware,notificationController.markAllNotificationsAsRead)
router.put("/:id/read",authMiddleware,notificationController.markNotificationAsRead)
router.delete("/:id",authMiddleware,notificationController.deleteNotification)

export default router