const dotenv = require("dotenv");
dotenv.config();

const required = ["MONGODB_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
if (process.env.NODE_ENV === "production") {
  for (const key of required)
    if (!process.env[key])
      throw new Error(`Falta la variable de entorno ${key}`);
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGODB_URI,
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((x) => x.trim()),
  accessSecret:
    process.env.JWT_ACCESS_SECRET || "development-access-secret-change-me",
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || "development-refresh-secret-change-me",
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  rateWindow: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateMax: Number(process.env.RATE_LIMIT_MAX || 100),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  iaDebugLogs: process.env.IA_DEBUG_LOGS === "true",
};
