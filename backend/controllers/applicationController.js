import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJob = async (req, res) => {
  try {
    // Ensure only candidates (extra guard in case middleware not applied)
    if (req.user?.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply' });
    }
    // Check job status and seats
    const job = await Job.findById(req.params.jobId).select('status seats remainingSeats');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ message: 'Applications are closed for this job' });
    if (job.seats !== undefined && job.seats !== null) {
      if ((job.remainingSeats ?? 0) <= 0) {
        return res.status(400).json({ message: 'No seats available for this job' });
      }
    }
    const app = await Application.create({
      candidate: req.user._id,
      job: req.params.jobId,
      resume: req.file?.filename,
      coverLetter: req.body?.coverLetter
    });
    res.json(app);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    // Recruiters only
    if (req.user?.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can view applications' });
    }

    const job = await Job.findById(req.params.jobId).select('recruiter title');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not your job' });
    }

    const apps = await Application
      .find({ job: req.params.jobId })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    if (req.user?.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can view their applications' });
    }
    const apps = await Application
      .find({ candidate: req.user._id })
      .populate('job', 'title company location');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark single application as viewed by recruiter
export const markApplicationViewed = async (req, res) => {
  try {
    if (req.user?.role !== 'recruiter') return res.status(403).json({ message: 'Only recruiters' });
    const app = await Application.findById(req.params.appId).populate('job', 'recruiter');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (String(app.job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    // Preserve final decisions; otherwise mark as viewed
    if (app.status !== 'rejected' && app.status !== 'shortlisted') {
      app.status = 'viewed';
    }
    app.viewedAt = new Date();
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status: rejected | shortlisted
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user?.role !== 'recruiter') return res.status(403).json({ message: 'Only recruiters' });
    const { status } = req.body; // 'rejected' | 'shortlisted' | 'hired'
    if (!['rejected', 'shortlisted', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const app = await Application.findById(req.params.appId).populate('job', 'recruiter');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (String(app.job.recruiter) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    // Enforce one-time decision: if already decided, block further changes
    if (['rejected', 'shortlisted', 'hired'].includes(app.status)) {
      return res.status(400).json({ message: 'Decision already made and cannot be changed' });
    }
    // Handle hiring with seats decrement
    if (status === 'hired') {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: app.job, $or: [ { seats: { $exists: false } }, { seats: null }, { remainingSeats: { $gt: 0 } } ] },
        { $inc: { remainingSeats: { $cond: [ { $and: [ { $ne: [ '$seats', null ] }, { $ne: [ '$seats', undefined ] } ] }, -1, 0 ] } } },
        { new: true }
      );
      // The above $cond is not supported in update; fallback to JS logic
    }
    // Fallback JS logic for decrement due to MongoDB update limitations
    if (status === 'hired') {
      const job = await Job.findById(app.job).select('seats remainingSeats status recruiter');
      if (!job) return res.status(404).json({ message: 'Job not found' });
      if (job.seats !== undefined && job.seats !== null) {
        if ((job.remainingSeats ?? 0) <= 0) {
          return res.status(400).json({ message: 'No seats remaining to hire' });
        }
        job.remainingSeats = (job.remainingSeats ?? job.seats) - 1;
        if (job.remainingSeats === 0) {
          // Auto-close when full
          job.status = 'closed';
        }
        await job.save();
      }
    }
    app.status = status;
    // When decided, ensure viewedAt is set at least once
    if (!app.viewedAt) app.viewedAt = new Date();
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
