import { config } from "dotenv";
config();

export const SECRETS = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING || "",
  postgresConnectionString: process.env.POSTGRES_CONNECTION_STRING || "",
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  jwtSecret: process.env.JWT_SECRET || "",
  accessTokenExpiration: process.env.ACCESSTOKEN_EXPIRATION || "10m",
  refreshTokenExpiration: process.env.REFRESHTOKEN_EXPIRATION || "7d",
  accessTokenMaxAge: process.env.ACCESSTOKEN_MAXAGE || 15 * 60 * 1000, // Default: 15 minutes
  refreshTokenMaxAge: process.env.REFRESHTOKEN_MAXAGE || 7 * 24 * 60 * 60 * 1000, // Default: 7 days
  reactAppCorsOrigin: process.env.REACT_APP_CORS_ORIGIN || "http://localhost:5173",
};
