// Middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET || "changeme";

export interface AuthRequest extends Request {
  user?: { id: string; email?: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET) as {
      id: string;
      email?: string;
      iat?: number;
      exp?: number;
    };
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (err) {
    console.error("auth verify error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
