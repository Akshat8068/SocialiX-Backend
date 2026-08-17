import AppDataSource from "../../config/app.DataSource.js";
import type { CreateNotificationData, NotificationQuery } from "../../types/types.js";
import { Notification } from "./notification.entity.js";

const notificationRepository = AppDataSource.getRepository(Notification)

const CreateNotification = async (data: CreateNotificationData): Promise<Notification> => {
    const notification = notificationRepository.create({
        recipientId: data.recipientId,
        senderId: data.senderId,
        type: data.type,
        postId: data.postId ?? null,
        commentId: data.commentId ?? null,
        conversationId: data.conversationId ?? null,
        message: data.message ?? null,
    });

    return await notificationRepository.save(notification);
}

const findByRecipientId = async (recipientId: number,
    query: NotificationQuery): Promise<[Notification[], number]> => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const skip = (page - 1) * limit;

    return await notificationRepository.findAndCount({
        where: {
            recipientId,
        },
        relations: {
            sender: true,
            post: true,
            comment: true,
            conversation: true,
        },
        order: {
            createdAt: "DESC",
        },
        skip,
        take: limit,
    });
}


const getUnreadCount = async (recipientId: number): Promise<number> => {
    return await notificationRepository.count({
        where: {
            recipientId,
            isRead: false,
        },
    });
}

const findById = async (id: number): Promise<Notification | null> => {
    return await notificationRepository.findOne({
        where: {
            id,
        },
        relations: {
            sender: true,
            post: true,
            comment: true,
            conversation: true,
        },
    });
}
const markAsRead = async (id: number): Promise<void> => {
    await notificationRepository.update(
        { id },
        {
            isRead: true,
        }
    );
}

const markAllAsRead = async (recipientId: number): Promise<void> => {
    await notificationRepository.update(
        {
            recipientId,
            isRead: false,
        },
        {
            isRead: true,
        }
    );
}
const deleteNotification = async (id: number): Promise<void> => {
    await notificationRepository.delete(id);
}
const notificationRepositoryMethods={deleteNotification,markAllAsRead,markAsRead,
    findById,getUnreadCount,findByRecipientId,CreateNotification
}

export default notificationRepositoryMethods