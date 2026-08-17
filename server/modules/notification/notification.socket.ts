import { getIO } from "../../config/socket.config.js";
import type { Notification } from "./notification.entity.js";

export const emitNotification = (
  notification: Notification
): void => {
  const io = getIO();

  io.to(`user:${notification.recipientId}`).emit(
    "newNotification",
    notification
  );
}