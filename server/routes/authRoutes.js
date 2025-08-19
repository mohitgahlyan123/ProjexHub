// server/routes/authRoutes.js
import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";
import { validateRegister, validateLogin } from "../middleware/validation.js";

const router = express.Router();

// User registration with validation
router.post("/register", validateRegister, register);

// User login with validation
router.post("/login", validateLogin, login);

// Get current user (protected route)
router.get("/me", authMiddleware, getMe);

export default router;
