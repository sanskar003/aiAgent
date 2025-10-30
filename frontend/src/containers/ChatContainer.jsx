import { useSelector, useDispatch } from "react-redux";
import { sendChatMessage, fetchHistory } from "../api/chat.js";
import {
  setMessages,
  addMessages,
  prependMessages,
} from "../slices/chatSlice.js";
import { useEffect, useRef, useState } from "react";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import Waves from "../components/Waves.jsx";

export default function ChatContainer() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { activeThreadId } = useSelector((state) => state.threads);
  const messages = useSelector((state) => state.chat.messages);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justLoaded, setJustLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  async function loadHistoryPage(pageNum) {
    if (!activeThreadId || !token) return;

    try {
      const history = await fetchHistory(token, activeThreadId, pageNum, 30);

      // Defensive check: ensure history is an array
      if (!Array.isArray(history)) {
        console.warn("Invalid history response or unauthorized thread access");
        setHasMore(false);
        return;
      }

      if (history.length < 20) setHasMore(false);
      dispatch(prependMessages(history));
    } catch (err) {
      console.error("Failed to load history page:", err);
      setHasMore(false); // Prevent further attempts if fetch fails
    }
  }

  useEffect(() => {
    if (token && activeThreadId) {
      setLoading(true);
      (async () => {
        try {
          const latest = await fetchHistory(token, activeThreadId, 1, 20);
          dispatch(setMessages(latest));
          setPage(2);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
        } finally {
          setLoading(false);
        }

        requestAnimationFrame(() => {
          const container = document.querySelector("#chat-container");
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
        });
      })();
    }
  }, [token, activeThreadId, dispatch]);

  if (!activeThreadId) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Select or create a thread to start chatting
      </div>
    );
  }

  async function handleSend() {
    const userMessage = { sender: "user", text: input };
    setInput("");

    dispatch(addMessages(userMessage));
    setIsTyping(true);

    try {
      const response = await sendChatMessage(
        token,
        [...messagesRef.current, userMessage],
        activeThreadId
      );

      requestAnimationFrame(() => {
        dispatch(addMessages({ sender: "ai", text: response.reply }));
        setIsTyping(false);
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setIsTyping(false);
    }
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center">
      <Waves
        lineColor="#b22222"
        backgroundColor="black"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="w-full max-w-3xl h-full flex flex-col items-center px-4 sm:px-6 md:px-8">
        <div
          id="chat-container" // ✅ Needed for scroll-to-bottom
          className="w-full h-[calc(100vh-160px)] mt-5 rounded-xl bg-white/10 backdrop-blur-2xl border border-zinc-700 shadow-md"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30"
                src="/images/loadingMessage.gif"
                alt="Loading messages ..."
              />
            </div>
          ) : (
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              page={page}
              setPage={setPage}
              hasMore={hasMore}
              loadHistoryPage={loadHistoryPage}
              justLoaded={justLoaded}
            />
          )}
        </div>

        <InputBar input={input} setInput={setInput} sendMessage={handleSend} />
      </div>
    </div>
  );
}
