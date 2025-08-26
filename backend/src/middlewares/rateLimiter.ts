import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const max = Number(process.env.RATE_LIMIT_MAX || 60);

export const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
