import express from "express";
import classRoomController from "../controllers/classroom.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", classRoomController.getAll);
router.get("/:id", classRoomController.getById);
router.post("/", classRoomController.create);
router.put("/:id", classRoomController.update);
router.delete("/:id", classRoomController.delete);

export default { path: "/api/modules/classrooms", router };
