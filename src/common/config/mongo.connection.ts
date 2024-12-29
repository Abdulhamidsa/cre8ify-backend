import mongoose from 'mongoose';

import { SECRETS } from '../config/config';
import { AppError } from '../errors/app.error';
import { getErrorMessage } from '../utils/error.utils';
import Logger from '../utils/logger';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(SECRETS.mongoConnectionString, {
      maxPoolSize: 10,
    });
    console.log('MongoDB connected', SECRETS.mongoConnectionString);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    Logger.error(`MongoDB connection failed: ${errorMessage}`);
    throw new AppError('Database connection error', 500);
  }
};
