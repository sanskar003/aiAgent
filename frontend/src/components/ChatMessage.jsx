import RichMessage from "../components/RichMessage";

function ChatMessage({ text, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        <div className="bg-red-600 w-fit max-w-[75%] px-3 py-1 rounded-2xl shadow-md">
          <RichMessage text={text} />
        </div>
      ) : (
        <div className="p-[2px] chat-scroll overflow-y-auto  rounded-2xl w-fit max-w-[90%]">
          <div className="  px-5 py-3 rounded-2xl  prose max-w-none">
            <RichMessage text={text} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;