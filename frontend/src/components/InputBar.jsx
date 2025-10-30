import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

export default function InputBar({ input, setInput, sendMessage }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const clean = DOMPurify.sanitize(trimmed, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    sendMessage(clean);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape") {
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full px-3 sm:px-5 md:px-6 max-w-3xl z-10">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-lg">
        <div
          className="flex items-center bg-zinc-900/80 rounded-xl px-3 py-2 gap-3 border border-white/10 shadow-md"
          role="form"
        >
          {/* Synthra Pulse Ring */}
          <div className="relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse z-0" />
            <div className="bg-white/10 backdrop-blur-sm rounded-full relative z-10 w-full h-full flex items-center justify-center">
              <div className="bg-gradient-to-r from-red-500/80 via-white/5 to-purple-500/80 backdrop-blur-sm rounded-full w-full h-full flex items-center justify-center">
                <img
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 "
                  src="/images/aiInterface.gif"
                  alt="Synthra AI"
                />
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow resize-none bg-transparent font-amiamie-round text-white placeholder-zinc-400 focus:outline-none text-sm sm:text-base max-h-60 overflow-y-auto leading-tight"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask Synthra anything..."
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`ml-1 rounded-full transition-all duration-300 flex items-center justify-center p-1 ${
              input.trim()
                ? "bg-red-500"
                : "bg-zinc-700 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <img
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform hover:scale-95"
              src="/images/input-sentIcon.png"
              alt="send"
            />
          </button>
        </div>
      </div>
    </div>
  );
}