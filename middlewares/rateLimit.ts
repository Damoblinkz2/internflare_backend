import rateLimit from "express-rate-limit";

// Strict limiter for login routes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max attempts
  message: {
    status: "fail",
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
