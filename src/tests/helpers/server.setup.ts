// /**
//  * Created by YourName - yourwebsite.com on 01/06/2025.
//  */

// import mongoose from 'mongoose';
// import express from 'express';
// import { createMongooseId } from './mock.data.js';
// import app from '../../../server.js';

// /**
//  * Connect to MongoDB.
//  * @param {string} uri - MongoDB connection string.
//  * @returns {Promise} - Resolves when connected, rejects on error.
//  */
// const connectToDatabase = (uri) => {
//     if (!uri || uri === 'null') {
//         console.error('Error: Database URI not defined', uri);
//         return Promise.reject(new Error('Database URI is undefined'));
//     }

//     console.log('Connecting to database:', uri);

//     return mongoose
//         .connect(uri)
//         .then(() => {
//             if (process.env.NODE_ENV !== 'TEST') {
//                 console.log('Database connected successfully');
//             }
//         })
//         .catch((error) => {
//             console.error('Database connection error:', error);
//             return Promise.reject(error);
//         });
// };

// /**
//  * Disconnect from MongoDB.
//  * @returns {Promise} - Resolves when disconnected, rejects on error.
//  */
// const disconnectFromDatabase = () => {
//     return mongoose
//         .disconnect()
//         .then(() => {
//             console.log('Database disconnected successfully');
//         })
//         .catch((error) => {
//             console.error('Error during database disconnection:', error);
//             return Promise.reject(error);
//         });
// };

// /**
//  * Start the server by connecting to MongoDB.
//  * @returns {Promise} - Resolves when server is ready, rejects on error.
//  */
// export const startServer = async () => {
//     const uri = process.env.MONGO_CONNECTION_STRING;

//     return connectToDatabase(uri)
//         .then(() => {
//             console.log('Server setup complete');
//         })
//         .catch((error) => {
//             console.error('Error during server startup:', error);
//             return Promise.reject(error);
//         });
// };

// /**
//  * Shutdown the server by disconnecting from MongoDB.
//  * @returns {Promise} - Resolves when server shutdown is complete, rejects on error.
//  */
// export const shutdownServer = async () => {
//     return disconnectFromDatabase()
//         .then(() => {
//             console.log('Server shutdown complete');
//         })
//         .catch((error) => {
//             console.error('Error during server shutdown:', error);
//             return Promise.reject(error);
//         });
// };

// /**
//  * Mocked Express application with middleware for testing.
//  */
// export const mockedApp = express();

// // Middleware to add a mocked userId to req.locals
// mockedApp.use((req, res, next) => {
//     req.locals = { userId: createMongooseId() };
//     next();
// });

// // Attach the actual application
// mockedApp.use(app);
