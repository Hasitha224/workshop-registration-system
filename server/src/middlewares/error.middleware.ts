import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err?.code === 11000) {
    res.status(409).json({ message: "A record with these details already exists" });
    return;
  }
  if (err?.name === "CastError") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};