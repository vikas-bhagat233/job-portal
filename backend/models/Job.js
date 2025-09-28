import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  seats: { type: Number, min: 0 },
  remainingSeats: { type: Number, min: 0 }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
