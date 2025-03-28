import express from "express";
import { constants } from "./utils/constants.utils.js";
import cors from "cors";
import { router } from "bull-board";
import swaggerUi from "swagger-ui-express";
import specs from "./utils/swagger.utils.js";

const app = express();

// Check for HTTPS enabling or not
const isHttpsEnabled = constants.isHttp2Enabled ? true : false;

/**
 * Initializes and configures the Express app, including:
 * 1. CORS configuration based on HTTPS.
 * 2. Middleware setup (express.json(), express.urlencoded()).
 * 3. Elasticsearch, Redis, and BullQueue initialization.
 * 4. Module loading based on config.
 */
if (isHttpsEnabled) {
  const allowedOrigins = [
    "https://localhost:3000",
    "https://127.0.0.1:4005",
    "https://localhost:4005",
    "https://192.168.1.60:4005",
    "https://122.175.19.236:4005"
  ];
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true); // Allow the request
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // Allow credentials (cookies, authorization headers)
      methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE']
    })
  );
} else {
  // During development, allow requests from any origin
  app.use(
    cors({
      origin: "*",
      methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE']
    })
  );
}

app.use("/queues", router);
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Swagger Integration
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;
