import { start } from "./server";
start();

// import express, { Request, Response } from "express";
// import dotenv from "dotenv";
// import exampleRouter from "./routes/example";
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());
// app.use("/api/example", exampleRouter);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to Express with TypeScript!");
// });
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log("Available APIs:");
//   app._router.stack.forEach((middleware: any) => {
//     if (middleware.route) {
//       console.log(` - ${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
//     }
//   });
// });
