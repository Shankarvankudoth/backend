import dotenv from "dotenv";
import path from "path";
import loggingService from "../services/logging.service.js";

const logger = loggingService.getModuleLogger("Constants Utility");

// Get the environment file from ENV_FILE or fallback to .env
const envFile = process.env.ENV_FILE || ".env";

const envPath =
  path.resolve(process.cwd(), envFile) || path.resolve("/root", envFile);

logger.debug("ENV Path got is : ", envPath);

// Configure dotenv to load the specific file
dotenv.config({ path: envPath });

export const constants = {
  server: {
    port: parseInt(process.env.SERVER_PORT)
  },
  mongo: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    ip: process.env.MONGODB_IP,
    port: parseInt(process.env.MONGODB_PORT),
    dbname: process.env.MONGODB_DBNAME
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST,
    port: parseInt(process.env.ELASTICSEARCH_PORT),
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  },
  jwt: {
    tokenSecret: process.env.JWT_TOKEN_SECRET
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || process.env.SMTP_USER
  },
  whatsapp: {
    url: process.env.WHATSAPP_API_URL
  },
  baseUrl: process.env.BASE_URL,
  isHttp2Enabled: process.env.HTTPS_ENABLED === "true",
  isSslEnabled: process.env.SSL_ENABLED === "true"
};
