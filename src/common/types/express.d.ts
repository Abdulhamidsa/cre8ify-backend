import 'express';

declare global {
  namespace Express {
    interface Request {
      locals?: {
        user?: {
          mongo_ref: string;
        };
      };
    }
  }
}

export {};
