import express, { Request, Response } from "express";
import exampleRouter from "./routes/example";
import { connectMongoDB } from "./common/config/mongo.connection";
import { SECRETS } from "./common/config/config";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
import userRouter from "./features/user/routes/user.route";
import expressErrorMiddleware from "./common/middleware/error.middleware";
import Logger from "./common/utils/logger";

const app = express();
const PORT = SECRETS.port;

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(limiter);
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express with TypeScript!");
});
app.use("/api/example", exampleRouter);
app.use("/api/users", userRouter);

// Error handling middleware
app.use(expressErrorMiddleware);

// Start function
export const start = async (): Promise<void> => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      Logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    Logger.error("Error starting server:");
    process.exit(1);
  }
};
