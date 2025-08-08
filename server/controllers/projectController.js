
import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(projects);
};

export const createProject = async (req, res) => {
  const { name, plan } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }
  const project = await Project.create({
    name,
    plan: plan || "FREE FOREVER",
    user: req.user.id,
  });

  res.status(210).json({
    message: "Project created successfully",
    project,
  });
};

export const deleteProject = async (req, res) => {
  try {
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
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteAllProjects = async (req, res) => {
  try {
    await Project.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "All projects deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete projects" });
  }
};




