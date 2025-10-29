// app.js
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

// ✅ CORS setup
const allowedOrigins = [
  "https://synthra.vercel.app",                 // FRONTEND SYNTHRA
  "https://sanskar-portfolio-ten.vercel.app",   // PORTFOLIO
  "http://localhost:5173",                      // LOCALHOST TEST  
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// ✅ JSON body parser
app.use(express.json({ limit: "20mb" }));

// ✅ MongoDB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Favicon and health check
app.get("/favicon.png", (req, res) => res.status(204).end());
app.get("/", (req, res) => res.send("Backend is running ✅"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/threads", threadRoutes);

export default app;