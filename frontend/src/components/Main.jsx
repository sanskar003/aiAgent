export default function InputBar({ input, setInput, sendMessage }) {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-6 md:px-8 max-w-3xl z-10">
      <div className="bg-zinc-600/80 backdrop-blur-md border-t border-zinc-700 rounded-3xl p-2">
        <div className="flex items-center bg-zinc-800 rounded-2xl px-3 sm:px-4 py-2 shadow-md border border-zinc-700 gap-3">

          {/* Synthra Logo Pulse Block */}
          <div className="relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse z-0" />
            <div className="bg-white/10 backdrop-blur-sm rounded-tr-full rounded-bl-full relative z-10 w-full h-full flex items-center justify-center">
              <div className="rotate-90 bg-red-500/35 backdrop-blur-sm rounded-tr-full rounded-bl-full w-full h-full flex items-center justify-center">
                <img
                  className="rotate-90 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  src="/images/aiInterface.gif"
                  alt="Synthra AI"
                />
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            rows={1}
            className="flex-grow resize-none bg-transparent font-amiamie text-white placeholder-gray-400 focus:outline-none text-base max-h-80 overflow-y-auto"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Know everything"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="ml-2 bg-red-500 hover:bg-red-700 rounded-full transition-colors text-white font-medium flex items-center justify-center p-1"
          >
            <img
              className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-90 transition-transform"
              src="/images/input-sentIcon.png"
              alt="send"
            />
          </button>
        </div>
      </div>
    </div>
  );
}