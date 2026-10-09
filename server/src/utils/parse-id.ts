import { isValidObjectId } from "mongoose";
import { AppError } from "./app-error.js";

export const parseId = (v: unknown): string => {
  if (typeof v !== "string" || !isValidObjectId(v)) throw new AppError("Invalid id", 400);
  return v;
};