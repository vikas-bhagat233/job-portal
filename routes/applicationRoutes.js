import express from "express";
import { applyJob, getApplications, getMyApplications, markApplicationViewed, updateApplicationStatus } from "../controllers/applicationController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Put static routes before dynamic ones to avoid conflicts
router.get("/me", protect, requireRole("candidate"), getMyApplications);
router.post("/:jobId", protect, requireRole("candidate"), upload.single("resume"), applyJob);
router.get("/:jobId", protect, getApplications);
router.patch("/status/:appId/viewed", protect, requireRole("recruiter"), markApplicationViewed);
router.patch("/status/:appId", protect, requireRole("recruiter"), updateApplicationStatus);

export default router;
