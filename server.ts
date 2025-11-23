import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./index.js";

// HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: "./.env" });

// Database connection
if (!process.env.DB || !process.env.DB_PASSWORD) {
  throw new Error("DB connection string or password not defined in .env");
}

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("Database connected successfully"))
  .catch((err: Error) => console.error("DB connection error:", err));

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// HANDLE UNHANDLED PROMISE REJECTIONS
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
