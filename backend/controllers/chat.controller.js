import Message from "../models/message.model.js";
import User from "../models/users.model.js";
import Thread from "../models/thread.model.js"; // ✅ make sure this is imported
import { graphApp } from "../langgraph/agent.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { checkpoints } from "../langgraph/agent.js";

export async function handleChat(req, res) {
  try {
    const { messages, threadID } = req.body;
    console.log("📩 Incoming request body:", messages);
    console.log("🔑 req.userId:", req.userId);
    console.log("🧵 Using threadID:", threadID);

    if (!threadID) {
      return res.status(400).json({ error: "Missing threadID in request body" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const thread = await Thread.findOne({ _id: threadID, userId: req.userId });
    if (!thread) return res.status(403).json({ error: "Invalid thread access" });

    const existingMemory = thread.memory || {};

    // Format messages for LangChain
    const MAX_HISTORY = 5;
    const MAX_CHARS = 2000;
    const trimmed = messages.slice(-MAX_HISTORY);

    const langchainMessages = trimmed.map((m) => {
      const safeText = String(m.text || "").slice(0, MAX_CHARS);
      return m.sender === "user"
        ? new HumanMessage({ content: safeText })
        : new AIMessage({ content: safeText });
    });

    const finalState = await graphApp.invoke(
      { messages: langchainMessages },
      { configurable: { thread_id: threadID } }
    );

    const aiMessage = finalState.messages.at(-1);
    console.log("🤖 AI raw response:", aiMessage);

    let formattedText = aiMessage.content;

    try {
      const parsed = JSON.parse(aiMessage.content);
      if (parsed.results && Array.isArray(parsed.results)) {
        formattedText = parsed.results
          .map((r) => {
            const title = r.title ? `## ${r.title}` : "";
            const url = r.url ? `[Source](${r.url})` : "";
            const content = r.content || "";
            return `${title}\n\n${url}\n\n${content}`;
          })
          .join("\n\n---\n\n");
      }
    } catch (err) {
      console.warn("⚠️ Could not parse AI content as JSON:", err.message);
    }

    await Message.create({ threadID, sender: "user", text: messages.at(-1).text });
    await Message.create({ threadID, sender: "ai", text: formattedText });

    //💾 Save updated memory back to thread
    const updatedMemory = await checkpoints.get(threadID);
    thread.memory = updatedMemory;
    await thread.save();

    res.json({ reply: formattedText });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}