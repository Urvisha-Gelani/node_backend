import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";

const JobSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    client_name: { type: String, required: true },
    job_title: { type: String, required: true },
    quote: { type: String, required: true },
    job_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    loginUserId: {
      type: Number,
      ref: "userId",
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

setUpdatedAt(JobSchema);
const Job = mongoose.model("Job", JobSchema);
export default Job;
