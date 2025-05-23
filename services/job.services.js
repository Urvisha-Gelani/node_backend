import { generateUniqueId } from "../helpers/index.js";
import Job from "../models/job.model.js";
import logger from "../utils/logger.js";
export const jobCreated = async (jobData) => {
  const nextJobId = await generateUniqueId("jobId");
  logger.info(`Job data: ${jobData}`);
  const tempJob = new Job({
    id: nextJobId,
    ...jobData,
  });
  await tempJob.save();
  return tempJob;
};
