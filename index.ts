import express from "express";
import rateLimit from "express-rate-limit";
import usersRouter from "./routes/userRoutes.js";
import jobsRouter from "./routes/jobRoutes.js";
import jobApplicationsRouter from "./routes/jobApplicationRoutes.js";
import onBoard from "./routes/onBoardRoutes.js";
import Review from "./routes/reviewRoutes.js";
import { AppError } from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

const app = express();

app.use(express.json());

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // allow 1000 requests per IP
  })
);

app.use("/jobs", jobsRouter);
app.use("/job-applications", jobApplicationsRouter);
app.use("/account", usersRouter);
app.use("/board", onBoard);
app.use("/reviews", Review);

// Catch-all route
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

// import crypto from "crypto";

// // Generate a 256-bit (32-byte) random secret key
// const jwtSecret = crypto.randomBytes(32).toString("hex");

// console.log("Your JWT Secret Key:", jwtSecret);
