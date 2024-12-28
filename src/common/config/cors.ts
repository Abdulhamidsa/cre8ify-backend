import { SECRETS } from './config';

export const corsOptions = {
  origin: SECRETS.reactAppCorsOrigin, // Ensure this is set to 'http://localhost:5173'
  credentials: true, //  include cookies in  requests
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // preflightContinue: false,
  // maxAge: 86400, // max age of 1 day for caching preflight requests in browser to reduce server load
};
