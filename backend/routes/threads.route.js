import express from "express";
import Thread from "../models/thread.model.js";
import Message from "../models/message.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🧠 Dynamic greeting generator
const getGreetingMessage = (name) => {
  const hour = new Date().getHours();
  let timeGreeting;

  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  const prompts = [
    `${timeGreeting}, ${name}. What would you like to explore today?`,
    `Hi ${name}, ready to dive into something new this ${timeGreeting.toLowerCase()}?`,
    `${timeGreeting}, ${name}. I'm here to help — ask me anything.`,
    `Welcome back, ${name}. What’s on your mind this ${timeGreeting.toLowerCase()}?`,
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
};

// ✅ Create new thread with Synthra greeting
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;
    const userName = req.userName || "friend"; // make sure verifyToken sets this

    const thread = await Thread.create({
      userId,
      title: title || "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const greeting = getGreetingMessage(userName);

    const message = await Message.create({
      threadID: thread._id.toString(),
      sender: "ai",
      text: greeting,
    });

    res.status(201).json({
      ...thread.toObject(),
      messages: [message],
    });
  } catch (error) {
    console.error("Thread creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all threads for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a thread and its messages
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found or not yours" });
    }

    await Message.deleteMany({ threadId: id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Rename a thread
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
