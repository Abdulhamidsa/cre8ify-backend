// import express, { Express, NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose';

// import app from '../../src/server.js';
// import { createMongooseId } from './helpers/mock.data.js';

// /**
//  * Extend the Request interface to include `locals` for storing user data.
//  */
// // declare module 'express' {
// //   interface Request {
// //     locals: {
// //       mongo_ref: string;
// //     };
// //   }
// // }

// /**
//  * Connect to MongoDB.
//  * @param {string} uri - MongoDB connection string.
//  * @returns {Promise<void>} - Resolves when connected, rejects on error.
//  */
// const connectToDatabase = async (uri: string): Promise<void> => {
//   if (!uri || uri === 'null') {
//     console.error('Error: Database URI is not defined:', uri);
//     throw new Error('Database URI is undefined');
//   }

//   try {
//     console.log('Connecting to database:', uri);
//     await mongoose.connect(uri);
//     if (process.env.NODE_ENV !== 'TEST') {
//       console.log('Database connected successfully');
//     }
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };

// /**
//  * Disconnect from MongoDB.
//  * @returns {Promise<void>} - Resolves when disconnected, rejects on error.
//  */
// const disconnectFromDatabase = async (): Promise<void> => {
//   try {
//     await mongoose.disconnect();
//     console.log('Database disconnected successfully');
//   } catch (error) {
//     console.error('Error during database disconnection:', error);
//     throw error;
//   }
// };

// /**
//  * Start the server by connecting to MongoDB.
//  * @returns {Promise<void>} - Resolves when server is ready, rejects on error.
//  */
// export const startServer = async (): Promise<void> => {
//   const uri = process.env.MONGO_CONNECTION_STRING;

//   if (!uri) {
//     console.error('MONGO_CONNECTION_STRING is not defined');
//     throw new Error('MONGO_CONNECTION_STRING is not defined');
//   }

//   try {
//     await connectToDatabase(uri);
//     console.log('Server setup complete');
//   } catch (error) {
//     console.error('Error during server startup:', error);
//     throw error;
//   }
// };

// /**
//  * Shutdown the server by disconnecting from MongoDB.
//  * @returns {Promise<void>} - Resolves when server shutdown is complete, rejects on error.
//  */
// export const shutdownServer = async (): Promise<void> => {
//   try {
//     await disconnectFromDatabase();
//     console.log('Server shutdown complete');
//   } catch (error) {
//     console.error('Error during server shutdown:', error);
//     throw error;
//   }
// };

// /**
//  * Mocked Express application with middleware for testing purposes.
//  */
// export const mockedApp: Express = express();

// /**
//  * Middleware to add a mocked userId to `req.locals`.
//  */
// mockedApp.use((req: Request, _res: Response, next: NextFunction) => {
//   req.locals = { mongo_ref: createMongooseId().toHexString() };
//   next();
// });

// // Attach the actual application
// mockedApp.use(app);
