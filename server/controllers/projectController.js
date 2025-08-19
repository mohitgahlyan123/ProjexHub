import Project from "../models/Project.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  
  res.json({
    success: true,
    count: projects.length,
    projects
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, plan } = req.body;

  const project = await Project.create({
    name: name.trim(),
    activePlan: plan || "FREE",
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }

  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.json({
    success: true,
    message: "Project deleted successfully"
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { name, status, activePlan, number } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { 
      ...(name && { name: name.trim() }),
      ...(status && { status }),
      ...(activePlan && { activePlan }),
      ...(number && { number: number.trim() })
    },
    { new: true, runValidators: true }
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.json({
    success: true,
    message: "Project updated successfully",
    project
  });
});

export const deleteAllProjects = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id);
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }

  const result = await Project.deleteMany({ user: req.user.id });

  res.json({
    success: true,
    message: `${result.deletedCount} projects deleted successfully`
  });
});
