export default function InputBar({ input, setInput, sendMessage }) {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-3xl rounded-3xl bg-zinc-600/80 backdrop-blur-md border-t border-zinc-700 p-2 z-10">
      <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-2 shadow-md border border-zinc-700">
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
        <button
          onClick={sendMessage}
          className="ml-2 bg-red-500 hover:bg-red-700 rounded-full transition-colors text-white font-medium flex items-center justify-center p-1"
        >
          <img
            className="w-7 h-7 hover:scale-90 transition-transform"
            src="/images/input-sentIcon.png"
            alt="send"
          />
        </button>
      </div>
    </div>
  );
}