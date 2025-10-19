import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import Message from "../models/message.model.js";

const router = express.Router();

// GET /api/history/:threadID
router.get("/:threadID", verifyToken, async (req, res) => {
  const { threadID } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  try {

    // Only fetch messages for this user's thread
    const messages = await Message.find({ threadID })
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(messages);
  } catch (err) {
    console.error("🔥 History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;