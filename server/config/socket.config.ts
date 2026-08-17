import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware.js";
import type { AuthenticatedSocket } from "../types/types.js";
import { registerChatSocket } from "../modules/chat/socket/chat.socket.js";

let io: Server;

// userId -> socketId
export const onlineUsers = new Map<number, string>();

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware)
  io.on("connection", (socket) => {

    const userId = (socket as AuthenticatedSocket).user.id;

    socket.join(`user:${userId}`);

    registerChatSocket(io, socket as AuthenticatedSocket);
  });

  return io;
};

export const getIO = () => io;