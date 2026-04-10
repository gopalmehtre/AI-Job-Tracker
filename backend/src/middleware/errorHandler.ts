import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({ message });
};

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default errorHandler;
