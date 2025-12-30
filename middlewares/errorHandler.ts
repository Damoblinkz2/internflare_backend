import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";

interface MongooseCastError {
  name: string;
  path: string;
  value: any;
}

interface MongooseDuplicateError {
  code: number;
  keyValue: Record<string, any>;
}

const handleCastErrorDB = (err: MongooseCastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err: MongooseDuplicateError): AppError => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "Unknown";
  const message = `Duplicate field value: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  if (req.originalUrl.startsWith("/jobs")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
    return;
  }

  console.error("DEV ERROR:", err);
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  // API
  if (req.originalUrl.startsWith("/jobs")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      return;
    }

    console.error("PROD ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
    return;
  }
};

const globalErrorHandler = (err: any, req: Request, res: Response): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
    return;
  }

  if (!err) return;

  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldDB(err);

  sendErrorProd(err, req, res);
};

export default globalErrorHandler;
