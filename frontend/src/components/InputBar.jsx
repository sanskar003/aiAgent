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

    // 🧼 Sanitize input to block HTML tags but preserve code-friendly characters
    const clean = DOMPurify.sanitize(trimmed, {
      ALLOWED_TAGS: [], // block all HTML tags
      ALLOWED_ATTR: [], // block all attributes
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
      <div className="bg-zinc-600/80 backdrop-blur-md border border-zinc-700 rounded-2xl p-1.5">
        <div
          className="flex items-center bg-zinc-800 rounded-xl px-2 sm:px-3 py-1.5 shadow-md border border-zinc-700 gap-3"
          role="form"
        >
          {/* Synthra Logo Pulse Block */}
          <div className="relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse z-0" />
            <div className="bg-white/10 backdrop-blur-sm rounded-tr-full rounded-bl-full relative z-10 w-full h-full flex items-center justify-center">
              <div className="rotate-90 bg-red-500/35 backdrop-blur-sm rounded-tr-full rounded-bl-full w-full h-full flex items-center justify-center">
                <img
                  className="rotate-90 w-4 h-4 sm:w-5 sm:h-5 lg:w-10 lg:h-10"
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
            className="flex-grow resize-none bg-transparent font-amiamie-round text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base max-h-60 overflow-y-auto leading-tight"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Know everything"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`ml-1 rounded-full transition-colors text-white font-medium flex items-center justify-center p-1 ${
              input.trim()
                ? "bg-red-500 hover:bg-red-700"
                : "bg-zinc-700 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <img
              className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-90 transition-transform"
              src="/images/input-sentIcon.png"
              alt="send"
            />
          </button>
        </div>
      </div>
    </div>
  );
}