import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepositoryMethods from "../users/user.repository.js";


interface TokenPayload extends jwt.JwtPayload {
  id: number;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const token = req.cookies.AccessToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access token not found",
        });
      }
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as unknown as TokenPayload;

      const user = await userRepositoryMethods.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;

      next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Access Token",
    });
  }
};

export default authMiddleware;