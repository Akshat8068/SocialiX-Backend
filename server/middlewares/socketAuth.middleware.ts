import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
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
     const token= socket.handshake.auth.token ||
  socket.handshake.headers.authorization?.replace("Bearer ", "") ||
  socket.handshake.query.token;

    if (!token) {
      return next(new Error("Access token is required"));
    }

    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as unknown as TokenPayload;

    if (!decoded) {
      return next(new Error("Invalid access token"));
    }

    const user = await userRepositoryMethods.findById(decoded.id);
console.log(decoded.id)
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