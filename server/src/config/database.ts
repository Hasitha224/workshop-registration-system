import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error: unknown) {
    console.error("Failed to connect to db: ", error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
