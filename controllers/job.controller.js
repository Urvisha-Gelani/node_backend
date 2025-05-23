import dotenv from "dotenv";
import { jobCreated } from "../services/job.services.js";
import { jobValidationSchema } from "../validation/job-validation/job.validation.js";
import Job from "../models/job.model.js";

dotenv.config();

export const createJob = async (req, res) => {
  const { client_name, job_title, job_date, quote, status } = req.body;
  const loginUserId = req.user.id;
  console.log(req.body, "req.body");
  console.log(loginUserId, "loginUserId");
  try {
    // Validate input
    await jobValidationSchema.validate(req.body, { abortEarly: false });

    const newJob = await jobCreated({
      client_name,
      job_title,
      job_date,
      quote,
      loginUserId,
      status,
    });

    if (!newJob) {
      return res.status(422).json({ message: "Job creation failed" });
    }

    res.status(201).json(newJob);
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(err, "Validation error");
      return res.status(422).json({
        message: "Validation error",
        errors: err.inner.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    console.log(err, "Error in job creation");
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const loginUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("Fetching jobs for user:", loginUserId);
    console.log("Pagination params:", { page, limit });

    // Get total number of jobs for this user
    const totalJobs = await Job.countDocuments({ loginUserId });
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await Job.find({ loginUserId })
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 }); // optional: order by date

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ jobs: [] });
    }
    res.set("total-pages", totalPages);
    res.set("total-users", totalJobs);
    res.set("current-page", page);
    res.set("limit", limit);
    res.status(200).json({ jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { client_name, job_title, job_date, quote, status } = req.body;
  const loginUserId = req.user.id;

  try {
    // Validate input
    await jobValidationSchema.validate(req.body, { abortEarly: false });

    const updatedJob = await Job.findOneAndUpdate(
      { id, loginUserId },
      { client_name, job_title, job_date, quote, status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({
        message: "Validation error",
        errors: err.inner.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const loginUserId = req.user.id;

  try {
    const deletedJob = await Job.findOneAndDelete({ id, loginUserId });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Server error" });
  }
};
