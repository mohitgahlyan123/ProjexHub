// server/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/errorHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists"
    });
  }

  // Create user
  const user = await User.create({ username, email, password });

  // Generate token
  const token = jwt.sign(
    { id: user._id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and check password
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});
