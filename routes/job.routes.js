import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from "../controllers/job.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const jobRoutes = express.Router();
jobRoutes.use(authenticateToken);
jobRoutes.post("/create/jobs", createJob);
jobRoutes.get("/jobs", getAllJobs);
jobRoutes.patch("/jobs/:id", updateJob);
jobRoutes.delete("/jobs/:id", deleteJob);
export default jobRoutes;
