import mongoose, { Document, Schema } from "mongoose";
import type { ApplicationStatus } from "../types";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: Date;
  jdLink?: string;
  jobDescription?: string;
  notes?: string;
  salaryRange?: string;
  location?: string;
  seniority?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  resumeSuggestions: { id: string; text: string }[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    jdLink: { type: String, trim: true },
    jobDescription: { type: String },
    notes: { type: String },
    salaryRange: { type: String, trim: true },
    location: { type: String, trim: true },
    seniority: { type: String, trim: true },
    requiredSkills: [{ type: String }],
    niceToHaveSkills: [{ type: String }],
    resumeSuggestions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IApplication>("Application", applicationSchema);
