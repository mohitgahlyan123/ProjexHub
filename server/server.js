import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "..", "client", "dist");
  console.log("Frontend path:", frontendPath);
  console.log("Dist exists:", fs.existsSync(frontendPath));

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
      console.log("dist file")
    });
  } else {
    console.warn("⚠️ Dist folder not found — frontend will not be served.");
  }
}

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();