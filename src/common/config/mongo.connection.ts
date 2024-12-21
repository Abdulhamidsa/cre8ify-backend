import mongoose from "mongoose";
import { SECRETS } from "./config";
import { AppError } from "../errors/app.error";

export const connectMongoDB = async (): Promise<void> => {
  try {
    const url = SECRETS.mongoConnectionString;
    if (!url) {
      throw new AppError("MongoDB connection string is not provided in SECRETS.", 500);
    }
    await mongoose.connect(url);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    if (error instanceof AppError) {
      console.error("Failed to connect to MongoDB:", error.message);
    } else {
      console.error("Failed to connect to MongoDB:", error);
    }
    process.exit(1);
  }
};
