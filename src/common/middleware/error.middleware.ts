import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../errors/app.error";
import { getErrorMessage } from "../utils/error.utils";
import Logger from "../utils/logger";

const expressErrorMiddleware: ErrorRequestHandler = (err: AppError | Error, _req: Request, res: Response, _next: NextFunction): void => {
  const isDev = process.env.NODE_ENV !== "production";
  const statusCode = err instanceof AppError ? err.status : 500;
  const message = getErrorMessage(err);

  // Log the error
  Logger.error(message); // Logs to console and file
  if (isDev && err.stack) {
    Logger.debug(`Stack Trace:\n${err.stack}`);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default expressErrorMiddleware;
