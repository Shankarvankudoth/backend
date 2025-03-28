import express from "express";
const router = express.Router();
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("Client Error");

router.post("/", (req, res) => {
  const { time, message, stack, componentStack } = req.body;

  // Log the error with consistent structure and type
  logger.error("Client-side Error", {
    time,
    message,
    stack,
    componentStack, // Include component stack
    type: "Client Error" // Crucial for filtering
  });

  res.status(200).json({ message: "Error logged successfully" });
});

export default {
  path: "/api/modules/error",
  router
};
