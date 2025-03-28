import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { config } from "../../../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management Module",
      version: "1.0.0",
      description: "API for managing users, projects, and tasks"
    },
    servers: [
      {
        url: config.baseUrl
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT Bearer token"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.resolve(__dirname, "../routes/project.routes.js"),
    path.resolve(__dirname, "../routes/user.routes.js"),
    path.resolve(__dirname, "../routes/task.routes.js"),
    path.resolve(__dirname, "../routes/auth.routes.js")
  ]
};

const specs = swaggerJsdoc(options);
export default specs;
