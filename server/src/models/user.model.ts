import { Schema, model, InferSchemaType } from "mongoose";
import { ROLES } from "../constants.ts/user.constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
