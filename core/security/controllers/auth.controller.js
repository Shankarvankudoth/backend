// authController.js
/*
import * as authService from "../services/auth.service.js";
import User from "../models/user.model.js";

export const authController = {
  login: async (req, res, next) => {
    try {
      await authService.loginUser(req, res, next, User);
    } catch (error) {
      next(error);
    }
  }
};

*/

import * as authService from "../services/auth.service.js";
import User from "../models/user.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("AuthController");

export const authController = {
  login: async (req, res, next) => {
    try {
      logger.info("Login request received", { email: req.body.email });

      // Call the login service
      const {token,user} = await authService.loginUser(req, res, next, User);

      // Log successful login
      logger.info("Login successful", { email: req.body.email });

      // Return the token to the client
      res.status(200).json({
        token,
        user,
      });
    } catch (error) {
      logger.error("Error during login", { error: error.message });

      // Handle specific errors
      if (error.message.includes("Invalid credentials")) {
        logger.warn("Invalid credentials", { email: req.body.email });
        return next(createError(401, "Invalid credentials"));
      }

      if (error.message.includes("User not found")) {
        logger.warn("User not found", { email: req.body.email });
        return next(createError(404, "User not found"));
      }

      // Handle generic errors
      next(createError(500, "Error during login"));
    }
  },
};
