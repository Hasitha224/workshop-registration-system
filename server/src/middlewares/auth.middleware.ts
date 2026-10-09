import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { Role } from "../types/user.types.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError("Authentication required", 401);

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header", 401);
    }

    let userId: string | undefined;
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      if (typeof decoded === "object" && decoded !== null) userId = decoded.sub;
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }
    if (!userId) throw new AppError("Invalid token payload", 401);

    // Read the user from the DB every time: role changes and deactivation apply immediately
    const user = await User.findById(userId);
    if (!user?.isActive) {
      throw new AppError("Account not found or deactivated", 401);
    }

    req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    next();
  } catch (error) {
    next(error); // the error handler turns AppError into the right status
  }
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do this", 403));
    }
    next();
  };