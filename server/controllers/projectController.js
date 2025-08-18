import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const createProject = async (req, res) => {
  const { name, plan } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }
  try {
    const project = await Project.create({
      name,
      activePlan: plan || "FREE",
      user: req.user.id,
    });
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await (await import('../models/User.js')).default.findById(req.user.id);
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  const { name, status, activePlan, number } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, status, activePlan, number },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteAllProjects = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await (await import('../models/User.js')).default.findById(req.user.id);
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    await Project.deleteMany({ user: req.user.id });
    res.json({ message: "All projects deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete projects" });
  }
};
