import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  deleteAllProjects
} from "../controllers/projectController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);
router.delete("/", authMiddleware, deleteAllProjects);

export default router;
