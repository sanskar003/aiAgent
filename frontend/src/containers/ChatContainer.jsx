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
import Profile from "../components/Profile.jsx";

export default function ChatContainer() {
  const dispatch = useDispatch();
  const { token, threadID } = useSelector((state) => state.auth);
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justLoaded, setJustLoaded] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  async function loadHistoryPage(pageNum) {
    const history = await fetchHistory(token, threadID, pageNum, 30);
    if (history.length < 20) setHasMore(false);
    dispatch(prependMessages(history)); // ✅ older messages at top
  }

  useEffect(() => {
    if (token && threadID) {
      (async () => {
        const latest = await fetchHistory(token, threadID, 1, 20); // ✅ latest 30
        dispatch(setMessages(latest));

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
      setPage(2); // next page will be older messages
    }
  }, [token, threadID]);

  async function handleSend() {
    const userMessage = { sender: "user", text: input };
    setInput("");

    // ✅ append the new user message at the bottom
    dispatch(addMessages(userMessage));

    setIsTyping(true);

    const response = await sendChatMessage(token, [
      ...messagesRef.current,
      userMessage,
    ]);

    requestAnimationFrame(() => {
      // ✅ append the AI reply at the bottom
      dispatch(addMessages({ sender: "ai", text: response.reply }));
      setIsTyping(false);
    });
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-start">
      <div className="absolute top-10 right-10">
        <img
          onClick={() => setIsOpenProfile(true)}
          className="w-8 h-8 border border-red-600 rounded-full p-1 hover:bg-red-500 cursor-pointer transition-all duration-300"
          src="/images/Sidebar-userIcon.png"
          alt="profile"
        />
        {isOpenProfile && <Profile onClose={() => setIsOpenProfile(false)} />}
      </div>
      <div className="w-2/3 h-full flex flex-col items-center">
        <div  className="w-full max-w-3xl h-[calc(100vh-160px)] mt-5 rounded-xl bg-white/10 backdrop-blur-2xl border border-zinc-700 shadow-md">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            page={page}
            setPage={setPage}
            hasMore={hasMore}
            loadHistoryPage={loadHistoryPage}
            justLoaded={justLoaded}
          />
        </div>
        <InputBar input={input} setInput={setInput} sendMessage={handleSend} />
      </div>
    </div>
  );
}
