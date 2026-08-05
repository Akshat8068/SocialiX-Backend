import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { registerChatSocket } from "../modules/chat/chat.socket.js";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware.js";
import type { AuthenticatedSocket } from "../types/types.js";

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
    console.log(`Connected: ${socket.id}`);

    registerChatSocket(io, socket as AuthenticatedSocket);
  });

  return io;
};

export const getIO = () => io;