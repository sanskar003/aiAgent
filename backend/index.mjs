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
  "https://synthra.vercel.app",               // deployed frontend
  "https://sanskar-portfolio-ten.vercel.app", // portfolio
  "http://localhost:5173",                    // Vite dev
  "http://localhost:3000"                     // CRA dev
];

// ✅ Apply CORS middleware once, after app is created
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ respond to preflight for all routes
app.options("*", cors());


// ✅ JSON body parser
app.use(express.json({ limit: "20mb" }));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/threads", threadRoutes);

// Connect to MongoDB
connectDB();

export default app;