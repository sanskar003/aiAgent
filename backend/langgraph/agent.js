import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";

// 🧠 Memory for conversation continuity
const checkpoints = new MemorySaver();

// 🔍 Tavily web search tool
const webSearch = new TavilySearch({
  maxResults: 3,
  topic: "general",
});

// 🔧 Bind tools to LLM
const tools = [webSearch];
const toolNode = new ToolNode(tools);

// 🤖 LLM with enhanced instructions
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
  maxRetries: 2,
}).bindTools(tools, {
  instructions: `
You are premium chatbot agent, a helpful, structured, markdown-savvy assistant.

Your goals:
- Respond with clarity, empathy, and precision.
- Use markdown formatting: headings, bullet points, links, tables, and code blocks.
- When answering with lists or product info, include images if available.
- Prefer tool-based, grounded answers over speculation.
- Ask clarifying questions if the user's intent is ambiguous.
- Avoid overly casual or robotic tone — be professional but friendly.
- When using TavilySearch, format results as rich cards or tables with title, summary, link, and image.
- If a user asks for a table, include headers and rows with clean formatting.
`,
});

// 🧵 Agent node
const MAX_HISTORY = 10;

async function callModel(state) {
  const trimmedMessages = state.messages.slice(-MAX_HISTORY);
  const response = await llm.invoke(trimmedMessages);
  return {
    messages: [...state.messages, response],
  };
}

// 🔀 Conditional routing
function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage?.tool_calls?.length > 0) return "tools";

  const userText = lastMessage?.content?.toLowerCase() || "";
  if (
    userText.includes("current") ||
    userText.includes("today") ||
    userText.includes("weather") ||
    userText.includes("time")
  ) {
    return "tools";
  }

  return "__end__";
}

// 🧩 Build LangGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "__end__");

export const graphApp = workflow.compile({ checkpoints });


// Format AI message for frontend
export function formatAIMessage(content) {
  if (typeof content === "string") {
    return { type: "text", reply: content.trim() };
  }

  //added this mermade 
   if (typeof content === "string" && content.includes("flowchart")) {
    return { type: "mermaid", reply: content };
  }


  if (Array.isArray(content)) {
    return {
      type: "list",
      reply: content.map((item) => ({
        title: item.title || "Untitled",
        url: item.url || null,
        summary: item.content || null,
      })),
    };
  }

  if (typeof content === "object" && content !== null) {
    return { type: "card", reply: content };
  }

  return { type: "text", reply: String(content) };
}
