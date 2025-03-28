import mongoose from "mongoose";
import { getMongoUrl } from "../utils/getUrl.utils.js";
import loggingService from "../../services/logging.service.js";

const logger = loggingService.getModuleLogger("Mongo DB Connection");

// Function to initialize the database connection
export const initializeDatabase = async () => {
  try {
    const mongoUrl = getMongoUrl(); // Use the utility to get the URL
    logger.info(`mongourl being used is ${mongoUrl}`);
    mongoose.connect(mongoUrl);

    mongoose.connection.on("connected", () => {
      logger.info(`Connected to mongodb at ${mongoUrl}`);
    });

    mongoose.connection.on("error", (err) => {
      logger.error("Error while connecting to server is ==", err);
    });
  } catch (error) {
    logger.error("Error connecting to the database:", error);
    process.exit(1);
  }
};
