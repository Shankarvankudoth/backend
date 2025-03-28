
import express from "express"; 
import bookController from "../controllers/book.controller.js"; 
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";  

const router = express.Router(); 
router.use(authenticateToken);  

router.get("/", bookController.getAll); 
router.get("/:id", bookController.getById); 
router.post("/", bookController.create); 
router.put("/:id", bookController.update); 
router.delete("/:id", bookController.delete);  

export default { 
  path: "/api/modules/books", 
  router 
};
