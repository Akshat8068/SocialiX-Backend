import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {parseCookie} from "cookie";
import userRepositoryMethods from "../repository/user.repository.js";
interface AuthenticatedSocket extends Socket {
  user: {
    id: number
  };
}interface TokenPayload extends jwt.JwtPayload{
  id: number;
}


export const socketAuthMiddleware = async(
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
     const cookies = parseCookie(socket.handshake.headers.cookie || "");

    const token = cookies.AccessToken

    if (!token) {
      return next(new Error("Access token is required"));
    }

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as unknown as TokenPayload;

    if (!decoded) {
      return next(new Error("Invalid access token"));
    }

    const user = await userRepositoryMethods.findById(decoded.id);
if (!user) {
  return next(new Error("User not found"));
}

(socket as AuthenticatedSocket).user = {
  id: user.id,
};

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};