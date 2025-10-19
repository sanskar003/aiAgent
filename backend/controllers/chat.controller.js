import Message from "../models/message.model.js";
import User from "../models/users.model.js";
import { graphApp } from "../langgraph/agent.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export async function handleChat(req, res) {
  try {
    const { messages } = req.body;
    console.log("📩 Incoming request body:", messages);
    console.log("🔑 req.userId:", req.userId);

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const threadID = user.threadID;
    console.log("🧵 Using threadID:", threadID);

    // Format messages correctly for LangChain
    const MAX_HISTORY = 5;
    const MAX_CHARS = 2000;

    const trimmed = messages.slice(-MAX_HISTORY);

    const langchainMessages = trimmed.map((m) => {
      const safeText = String(m.text || "").slice(0, MAX_CHARS);
      return m.sender === "user"
        ? new HumanMessage({ content: safeText })
        : new AIMessage({ content: safeText });
    });

    // Invoke LangGraph agent with full history
    const finalState = await graphApp.invoke(
      { messages: langchainMessages },
      { configurable: { thread_id: threadID } }
    );

    const aiMessage = finalState.messages.at(-1);
    console.log("🤖 AI raw response:", aiMessage);

    // Format AI response if it's JSON with results[]
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

    // Save user message
    await Message.create({
      threadID,
      sender: "user",
      text: messages.at(-1).text,
    });

    // Save formatted AI response
    await Message.create({
      threadID,
      sender: "ai",
      text: formattedText,
    });

    // Send back only the new AI message
    res.json({ reply: formattedText });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}