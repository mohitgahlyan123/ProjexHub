import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "Created",
  },
  activePlan: {
    type: String,
    default: "FREE",
    enum: ["FREE", "PREMIUM", "ENTERPRISE"],
  },
  number: {
    type: String,
    default: "N/A",
  },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
