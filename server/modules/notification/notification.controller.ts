import type { NextFunction, Request, Response } from "express";
import notificationRepositoryMethods from "./notification.repository.js";
import type { CreateNotificationData } from "../../types/types.js";
import { emitNotification } from "./notification.socket.js";
import type { Notification } from "./notification.entity.js";

const getNotifications = async (req: Request,res: Response,next:NextFunction) => {
  try {
    const userId = req.user.id

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const [notifications, total] =
      await notificationRepositoryMethods.findByRecipientId(userId,
        {
          page,
          limit,
        }
      )

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
const createNotification = async (
  data: CreateNotificationData
): Promise<Notification | null> => {
  if (data.recipientId === data.senderId) {
    return null;
  }

  const notification =
    await notificationRepositoryMethods.CreateNotification(data)

  emitNotification(notification)

  return notification;
};


const getUnreadCount = async (req: Request,res: Response,next:NextFunction) => {
  try {
    const userId = req.user.id

    const count =
      await notificationRepositoryMethods.getUnreadCount(
        userId
      )

    return res.status(200).json({
      success: true,
      message: "Unread notification count fetched successfully",
      data: {
        count,
      },
    })
  } catch (error) {
    next(error)
}
}

const markNotificationAsRead = async (req: Request,res: Response,next:NextFunction) => {
  try {
    const notificationId = Number(req.params.id)
    const userId = req.user.id

    const notification =
      await notificationRepositoryMethods.findById(notificationId)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    if (notification.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this notification",
      })
    }

    await notificationRepositoryMethods.markAsRead(
      notificationId
    )

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    next(error)
  }
}

const markAllNotificationsAsRead = async (req: Request,res: Response,next:NextFunction) => {
  try {
    const userId = req.user.id

    await notificationRepositoryMethods.markAllAsRead(userId)

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    next(error)
  }
}

const deleteNotification = async (req: Request,res: Response,next:NextFunction) => {
  try {
    const notificationId = Number(req.params.id)
    const userId = req.user.id

    const notification =
      await notificationRepositoryMethods.findById(notificationId)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    if (notification.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this notification",
      })
    }

    await notificationRepositoryMethods.deleteNotification(
      notificationId
    )

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

const notificationController={createNotification,getUnreadCount,deleteNotification,markNotificationAsRead,getNotifications,markAllNotificationsAsRead}

export default notificationController