import winston from "winston";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, align } = winston.format;

class LoggingService {
  constructor() {
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4
    };

    this.LOG_LEVEL = process.env.LOG_LEVEL || "info";
    this.logsDir = path.join(process.cwd(), "logs");

    // Ensure logs directory exists
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }

    this.initializeLogger();
    this.setupProcessHandlers();
  }

  // GREATLY SIMPLIFIED sanitizeObject
  sanitizeObject(obj) {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== "object") {
      return obj;
    }

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (obj instanceof Error) {
      return {
        message: obj.message,
        name: obj.name,
        stack: obj.stack
      };
    }
    // Handle Arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "function") {
        continue; // Skip functions
      }
      try {
        sanitized[key] = this.sanitizeObject(value);
      } catch (e) {
        sanitized[key] = "[Error serializing value]";
      }
    }
    return sanitized;
  }

  // Safer metadata formatting
  formatMetadata(meta) {
    try {
      const sanitizedMeta = this.sanitizeObject(meta);
      return JSON.stringify(sanitizedMeta); // Simple stringification
    } catch (err) {
      return `[Error formatting metadata: ${err.message}]`;
    }
  }

  createLogFormat() {
    return combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      align(),
      printf((info) => {
        const {
          timestamp,
          level,
          message,
          module,
          method,
          path,
          status,
          stack,
          duration,
          userId,
          ...meta
        } = info;

        let logMessage = `[${timestamp}] ${level}: ${message}`;

        // Add standard fields if present
        const fields = {
          Module: module,
          Method: method,
          Path: path,
          Status: status,
          Duration: duration,
          UserId: userId
        };

        Object.entries(fields).forEach(([key, value]) => {
          if (value !== undefined) {
            logMessage += ` | ${key}: ${value}`;
          }
        });

        // Add stack trace for errors
        if (stack) {
          logMessage += `\nStack: ${stack}`;
        }

        // Handle metadata
        const metadataStr = this.formatMetadata(meta);
        if (metadataStr && metadataStr !== "{}") {
          logMessage += "\nMetadata: " + metadataStr;
        }

        return logMessage;
      })
    );
  }

  initializeLogger() {
    const fileRotateTransport = new DailyRotateFile({
      filename: path.join(this.logsDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "debug" // Always log everything to file
    });

    const errorRotateTransport = new DailyRotateFile({
      filename: path.join(this.logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "error"
    });

    // NEW: Dedicated transport for client errors
    const clientErrorFilter = winston.format((info) => {
      return info.type === "Client Error" ? info : false;
    });

    const clientErrorTransport = new DailyRotateFile({
      filename: path.join(this.logsDir, "client-error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "error",
      format: combine(clientErrorFilter(), this.createLogFormat())
    });

    this.logger = winston.createLogger({
      levels: this.logLevels,
      level: this.LOG_LEVEL,
      format: this.createLogFormat(),
      transports: [
        fileRotateTransport,
        errorRotateTransport,
        clientErrorTransport,
        new winston.transports.Console({
          level: this.LOG_LEVEL,
          handleExceptions: true
        })
      ],
      exitOnError: false
    });
  }

  setupProcessHandlers() {
    process.on("uncaughtException", (err) => {
      this.logger.error("Uncaught Exception", {
        message: err.message,
        stack: err.stack,
        module: "Process"
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logger.error("Unhandled Rejection", {
        reason: reason,
        module: "Process"
      });
    });

    process.on("exit", () => {
      this.logger.info("Process Exit", { module: "Process" });
      this.logger.end();
    });
  }

  getModuleLogger(moduleName) {
    return {
      error: (message, meta = {}) => {
        this.logger.error(message, { ...meta, module: moduleName });
      },
      warn: (message, meta = {}) => {
        this.logger.warn(message, { ...meta, module: moduleName });
      },
      info: (message, meta = {}) => {
        this.logger.info(message, { ...meta, module: moduleName });
      },
      http: (message, meta = {}) => {
        this.logger.http(message, { ...meta, module: moduleName });
      },
      debug: (message, meta = {}) => {
        this.logger.debug(message, { ...meta, module: moduleName });
      }
    };
  }

  // Request logging middleware
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;
        this.logger.http("HTTP Request", {
          module: "HTTP",
          method: req.method,
          path: req.path,
          status: res.statusCode,
          duration: `${duration}ms`,
          userId: req && req.user ? req.user._id : undefined
        });
      });

      next();
    };
  }
}

// Create and export a singleton instance
const loggingService = new LoggingService();
export default loggingService;
