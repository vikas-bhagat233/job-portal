import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    // Normalize seats input
    let seats = req.body.seats;
    if (seats !== undefined && seats !== null && seats !== '') {
      seats = Number(seats);
      if (Number.isNaN(seats) || seats < 0) {
        return res.status(400).json({ message: 'Invalid seats value' });
      }
    } else {
      seats = undefined; // unlimited if not provided
    }

    const payload = { ...req.body, recruiter: req.user._id };
    if (seats !== undefined) {
      payload.seats = seats;
      payload.remainingSeats = seats;
      if (seats === 0) payload.status = 'closed';
    }
    const job = await Job.create(payload);
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search && search.trim()) {
      const rx = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: rx },
        { company: rx },
        { location: rx }
      ];
    }
    // Show only open jobs for public listing
    filter.status = 'open';

    const jobs = await Job.find(filter).populate("recruiter", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email");
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not your job' });
    }
    job.status = status;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
