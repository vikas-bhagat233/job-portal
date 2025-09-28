import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resume: String,
  coverLetter: String,
  status: { type: String, enum: ['applied', 'viewed', 'rejected', 'shortlisted', 'hired'], default: 'applied' },
  viewedAt: Date
}, { timestamps: true });

// Prevent duplicate applications per candidate per job
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
