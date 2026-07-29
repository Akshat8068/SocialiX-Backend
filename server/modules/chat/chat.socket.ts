import { Server, Socket } from "socket.io";

import { onlineUsers } from "../../config/socket.config.js";
import chatController from "./chat.controller.js";

import {
  joinConversationSchema,
  sendMessageSchema,
  typingSchema,
  markSeenSchema,
  deleteForEveryoneSchema,
} from "./chat.validations.js";
import type { AuthenticatedSocket } from "../../types/types.js";



export const registerChatSocket = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  console.log(`User Connected: ${socket.id}`);

  // User online (JWT middleware se user mil gaya)
  onlineUsers.set(socket.user.id, socket.id);

  console.log(`User ${socket.user.id} online`);

  // Join Conversation
  socket.on("joinConversation", async (data) => {

    const result = joinConversationSchema.safeParse(data);
 console.log("joinConversation:", data);
 console.log("joinConversation event received:", data);
    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.joinConversation(
      io,
      socket,
      result.data
    );

  });

  // Send Message
  socket.on("sendMessage", async (data) => {
 console.log("sendMessage event:", data);
    const result = sendMessageSchema.safeParse(data);

    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.sendMessage(
      io,
      socket,
      result.data
    );

  });

  // Typing Start
  socket.on("typingStart", async (data) => {

    const result = typingSchema.safeParse(data);

    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.typingStart(
      io,
      socket,
      result.data
    );

  });

  // Typing Stop
  socket.on("typingStop", async (data) => {

    const result = typingSchema.safeParse(data);

    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.typingStop(
      io,
      socket,
      result.data
    );

  });

  // Mark Seen
  socket.on("markSeen", async (data) => {

    const result = markSeenSchema.safeParse(data);

    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.markSeen(
      io,
      socket,
      result.data
    );

  });

  // Delete For Everyone
  socket.on("deleteForEveryone", async (data) => {

    const result = deleteForEveryoneSchema.safeParse(data);

    if (!result.success) {
      return socket.emit("error", {
        message: result.error.issues[0]?.message,
      });
    }

    await chatController.deleteForEveryone(
      io,
      socket,
      result.data
    );

  });

  // Disconnect
  socket.on("disconnect", async () => {

    onlineUsers.delete(socket.user.id);

    console.log(`User ${socket.user.id} offline`);

    await chatController.disconnect(io, socket);

    console.log(`User Disconnected: ${socket.id}`);

  });

};