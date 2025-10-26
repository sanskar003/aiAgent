import express from "express";
import Thread from "../models/thread.model.js";
import Message from "../models/message.model.js";
import { verifyToken }  from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create new thread
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title } = req.body;

    const thread = await Thread.create({
      userId: req.userId,   // ✅ comes from middleware
      title: title || "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all threads for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a thread (only if it belongs to the logged-in user)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findOneAndDelete({ _id: id, userId: req.userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found or not yours" });
    }

    await Message.deleteMany({ threadId: id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename a thread (only if it belongs to the logged-in user)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const thread = await Thread.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ error: "Thread not found or not yours" });
    }

    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;