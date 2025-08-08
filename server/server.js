import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
const port = process.env.PORT || 4000;


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running on ${process.env.BACKEND_URL || `http://localhost:${port}`}`);
    });
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();
