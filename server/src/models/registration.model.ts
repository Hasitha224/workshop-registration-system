import { Schema, model, InferSchemaType } from "mongoose";
import { REG_STATUSES } from "../constants.ts/registration.constants.js";

const registrationSchema = new Schema(
  {
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
      index: true,
    },
    attendeeName: {
      type: String,
      required: true,
      trim: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: REG_STATUSES,
      default: "active",
    },
    registeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true },
);

// One Active registration per email per workshop. Preservation of history
registrationSchema.index(
  { workshopId: 1, attendeeEmail: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

export type IRegistration = InferSchemaType<typeof registrationSchema>;
export const Registration = model("Registration", registrationSchema);
