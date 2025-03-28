// // auth.service.js
// import { generateAccessToken } from "../utils/jwt.utils.js";
// import { createError } from "../../../services/errorhandling.service.js";
// import loggingService from "../../../services/logging.service.js";

// // Initialize the logger for the AuthService
// const logger = loggingService.getModuleLogger("AuthService");

// /**
//  * Login a user
//  * Logs the operation, validates credentials, and generates an access token.
//  * @param {object} req - Express request object.
//  * @param {object} res - Express response object.
//  * @param {function} next - Express next middleware function.
//  * @param {object} User - User model for database interaction.
//  */
// export const loginUser = async (req, res, next, User) => {
//   logger.info("Login attempt", { email: req.body.email });

//   try {
//     const { email, password } = req.body;

//     // Verify user credentials
//     logger.info("Verifying user credentials", { email });
//     const user = await User.findOne({ email, password });

//     if (!user) {
//       logger.warn("Login failed - Invalid credentials", {user});
//       throw createError(401, "Incorrect email or password");
//     }

//     if (!user.isActive) {
//       logger.warn("Login failed - Inactive account", {
//         email,
//         userId: user._id
//       });
//       throw createError(403, "User account is inactive");
//     }

//     // Validate user version
//     logger.debug("Checking user version", {
//       userId: user._id,
//       version: user.version
//     });
//     if (![1, 2, 3].includes(user.version)) {
//       logger.error("Unsupported user version", {
//         userId: user._id,
//         version: user.version
//       });
//       throw createError(400, "Unsupported user version");
//     }

//     const {
//       fullname,
//       username,
//       phoneNumber,
//       designation,
//       role,
//       permissions,
//       branch,
//       isActive,
//       version,
 
//       _id
//     } = user;

//     // Generate an access token
//     logger.info("Generating access token", { userId: _id, username, role });
//     const token = generateAccessToken({
//       _id,
//       fullname,
//       username,
//       email,
//       phoneNumber,
//       designation,
//       permissions,
//       role,
//       branch,
//       isActive,
//       version
//     });

//     logger.info("User logged in successfully", { userId: _id, username, role });

//     res.status(200).json({
//       token,
//       user: {
//         _id,
//         fullname,
//         username,
//         email,
//         phoneNumber,
//         permissions,
//         designation,
//         role,
//         branch,
//         isActive,
//         version
//       }
//     });
//   } catch (error) {
//     logger.error("Login error", { error: error.message, stack: error.stack });

//     // Send appropriate error message to the frontend
//     switch (error.status) {
//       case 400:
//         return next(createError(400, "Unsupported user version"));
//       case 401:
//         return next(createError(401, "Incorrect email or password"));
//       case 403:
//         return next(createError(403, "User account is inactive"));
//       default:
//         return next(createError(500, "Internal server error"));
//     }
//   }
// };


import { generateAccessToken } from "../utils/jwt.utils.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

// Initialize the logger for the AuthService
const logger = loggingService.getModuleLogger("AuthService");

/**
 * Login a user
 * Logs the operation, validates credentials, and generates an access token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @param {object} User - User model for database interaction.
 */
export const loginUser = async (req, res, next, User) => {
  logger.info("Login attempt", { email: req.body.email });

  try {
    const { email, password } = req.body;

    // Verify user credentials
    logger.info("Verifying user credentials", { email });
    const user = await User.findOne({ email, password }).lean();

    if (!user) {
      logger.warn("Login failed - Invalid credentials", { email });
      throw createError(401, "Incorrect email or password");
    }

    if (!user.isActive) {
      logger.warn("Login failed - Inactive account", { email, userId: user._id });
      throw createError(403, "User account is inactive");
    }

    // Validate user version
    logger.debug("Checking user version", { userId: user._id, version: user.version });
    if (![1, 2, 3].includes(user.version)) {
      logger.error("Unsupported user version", { userId: user._id, version: user.version });
      throw createError(400, "Unsupported user version");
    }

    // Extract role and branch information
    const branchRoles = user.roles?.branchAndRole || [];
    const roleData = branchRoles.map(({ branchName, roleId }) => ({ branchName, roleId }));

    // Generate an access token
    logger.info("Generating access token", { userId: user._id, email });
    const token = generateAccessToken({
      _id: user._id,
      email: user.email,
      isActive: user.isActive,
      version: user.version,
      roles: roleData // Store roles in token
    });

    logger.info("User logged in successfully", { userId: user._id, email });

    return { 
      token,
      user: {
        _id: user._id,
        email: user.email,
        isActive: user.isActive,
        version: user.version,
        roles: roleData
      }
    };
  } catch (error) {
    logger.error("Login error", { error: error.message, stack: error.stack });

    // Send appropriate error message to the frontend
    switch (error.status) {
      case 400:
        return next(createError(400, "Unsupported user version"));
      case 401:
        return next(createError(401, "Incorrect email or password"));
      case 403:
        return next(createError(403, "User account is inactive"));
      default:
        return next(createError(500, "Internal server error"));
    }
  }
};