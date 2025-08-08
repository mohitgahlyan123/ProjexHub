// server/routes/projectRoutes.js
import express from 'express';
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  deleteAllProjects
} from '../controllers/projectController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.delete('/:id', authMiddleware, deleteProject);
router.delete('/', authMiddleware, deleteAllProjects);

router.put('/:id', authMiddleware, updateProject);

export default router;
