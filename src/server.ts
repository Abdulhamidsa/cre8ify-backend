import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import exampleRouter from "./routes/example";
import { connectMongoDB } from "./common/config/mongo.connection";
import { SECRETS } from "./common/config/config";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import { rateLimit } from "express-rate-limit";
import userRouter from "./features/user/routes/user.route";
import expressListRoutes from "express-list-routes";
import { AppError } from "./common/errors/app.error";
import { getErrorMessage } from "./common/utils/error.utils";
// import projectRouter from "./features/project/routes/project.route";
const app = express();
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });
dotenv.config();
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(limiter);

const PORT = SECRETS.port || 3000;

// Middlewares
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express with TypeScript!");
});
app.use("/api/example", exampleRouter);
app.use("/api/users", userRouter);
// app.use("/api/projects", projectRouter);

// Start function
export const start = async (): Promise<void> => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Available APIs:");
      expressListRoutes(app); // Assuming this lists all registered routes
    });
  } catch (error) {
    console.error("Failed to start the application:", error); // Log the full error
    new AppError(getErrorMessage(error), 500); // Wrap the error (if needed for further handling)
    process.exit(1);
  }
};
