import mongoose from "mongoose";
import { SECRETS } from "../config/config";
import Logger from "../utils/logger";
import { AppError } from "../errors/app.error";
import { getErrorMessage } from "../utils/error.utils";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(SECRETS.mongoConnectionString, {
      maxPoolSize: 10,
    });
    Logger.info("MongoDB connected successfully");
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    Logger.error(`MongoDB connection failed: ${errorMessage}`);
    throw new AppError("Database connection error", 500);
  }
};
