import express from "express";
import { createJob, getJobs, getJobById, getMyJobs, updateJobStatus } from "../controllers/jobController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireRole("recruiter"), createJob);
router.get("/", getJobs);
router.get("/recruiter/me", protect, requireRole("recruiter"), getMyJobs);
router.get("/:id", getJobById);
router.patch("/:id/status", protect, requireRole("recruiter"), updateJobStatus);

export default router;
