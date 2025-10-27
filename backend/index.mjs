import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import historyRoutes from "./routes/history.route.js";
import threadRoutes from "./routes/threads.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/threads", threadRoutes);

// Connect to MongoDB once (outside of handler)
connectDB();

export default app;