import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import User from "../models/userModel.js";
import CompanyProfile from "../models/companyProfileModel.js";

/**
 * Middleware to protect routes and check for valid JWT token in Authorization header.
 * Grants access to authenticated users only.
 * Attaches user data to request object.
 * Calls next() middleware if successful, otherwise passes error to next.
 */
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from Authorization headers (format: Bearer token)
    let token: string | undefined;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token, user is not logged in
    if (!token) {
      return next(new AppError("You are not logged in!", 401));
    }

    // 3. Verify token using JWT_SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 4. Check if user still exists in DB (e.g. account not deleted)
    let currentUser;

    switch (decoded.accountType) {
      case "personal":
        currentUser = await User.findById(decoded.id);
        break;
      case "company":
        currentUser = await CompanyProfile.findById(decoded.id);
        break;
      default:
        return next(new AppError("Invalid token", 401));
    }

    if (!currentUser) {
      return next(new AppError("Account no longer exists", 401));
    }

    // 5. Attach user object to request for downstream middlewares and route handlers
    req.user = currentUser;
    // (req as any).user = currentUser;

    // 6. Allow access
    next();
  } catch (err) {
    next(err);
  }
};
