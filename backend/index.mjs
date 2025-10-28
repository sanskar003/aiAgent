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

// ✅ Define allowed origins
const allowedOrigins = [
  "https://synthra.vercel.app", // deployed frontend
  "https://sanskar-portfolio-ten.vercel.app", // portfolio
];

// ✅ Apply CORS middleware once, after app is created
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


// ✅ JSON body parser
app.use(express.json({ limit: "20mb" }));


app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
}); // ✅ Connect to MongoDB Atlas

app.get("/favicon.png", (req, res) => {
  res.status(204).end(); // No Content
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/threads", threadRoutes);



export default app;
