import { Schema, model, InferSchemaType } from "mongoose";
import { WORKSHOP_STATUSES } from "../constants.ts/workshop.constants.js";

const workshopSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    startsAt: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    activeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: WORKSHOP_STATUSES,
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

workshopSchema.index({ startsAt: 1 });
workshopSchema.index({ status: 1, startsAt: 1 });

workshopSchema.pre("validate", function () {
  if (this.activeCount > this.capacity) {
    this.invalidate("activeCount", "activeCount cannot exceed capacity");
  }
});

export type IWorkshop = InferSchemaType<typeof workshopSchema>;
export const Workshop = model("Workshop", workshopSchema);
