import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { AppError } from "./utils/app-error.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGIN.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));


// app.use("/api/v1/tickets", ticketRoutes);
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Workshop app API is healthy",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("application error: ", error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

export default app;
