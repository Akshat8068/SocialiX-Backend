import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepositoryMethods from "../repository/user.repository.js";

interface TokenPayload extends jwt.JwtPayload{
  id: number;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1]!;

      const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as unknown as TokenPayload;

      const user = await userRepositoryMethods.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Access Token",
    });
  }
};

export default authMiddleware;