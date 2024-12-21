import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

const expressErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default expressErrorMiddleware;
