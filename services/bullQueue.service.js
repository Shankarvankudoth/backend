import Queue from "bull";
import { constants } from "../utils/constants.utils.js";
import loggerService from "./logging.service.js";

const logger = loggerService.getModuleLogger("Bull Queue Service");
const redisConfig = {
  redis: {
    host: constants.redis.host,
    port: constants.redis.port
  }
};

const jobQueue = new Queue("jobQueue", redisConfig);

jobQueue.on("failed", (job, err) => {
  logger.error(`Job ${job.id} failed:`, err);
});

jobQueue.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

export default jobQueue;
