import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js";
import historyRoutes from "./routes/history.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: "20mb"}));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);


// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
});