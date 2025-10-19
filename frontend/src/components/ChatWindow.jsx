import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ChatMessage from "../components/ChatMessage";

export default function ChatWindow({
  messages = [],
  isTyping,
  page,
  setPage,
  hasMore,
  loadHistoryPage,
  justLoaded,
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  useEffect(() => {
    const container = parentRef.current;
    const handleScroll = () => {
      if (container.scrollTop < 100 && hasMore) {
        const previousScrollHeight = container.scrollHeight;

        loadHistoryPage(page).then(() => {
          setPage((prev) => prev + 1);

          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            container.scrollTop += scrollDiff; // ✅ preserve position
          });
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

const prevLastId = useRef(null);

useEffect(() => {
  if (messages.length === 0 || !parentRef.current) return;

  const lastMsg = messages[messages.length - 1];
  const lastId = lastMsg?._id || lastMsg?.text;

  if (lastId !== prevLastId.current) {
    parentRef.current.scrollTo({
      top: parentRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  prevLastId.current = lastId;
}, [messages]);

  return (
    <div
      ref={parentRef}
      className="flex-1 p-4 overflow-y-auto relative"
      style={{ height: "calc(100vh - 160px)" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const msg = messages[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              ref={(el) => rowVirtualizer.measureElement(el)}
              data-index={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ChatMessage text={msg.text} sender={msg.sender} />
            </div>
          );
        })}
      </div>

      {isTyping && (
        <div className="flex justify-start mt-2 animate-fade-in">
          <div className="px-4 py-2 rounded-lg shadow-md w-fit transition-all duration-300 ease-out">
            <img
              src="/gif/thinkingAi2.gif"
              alt="Thinking"
              className="h-9 w-9"
            />
          </div>
        </div>
      )}
    </div>
  );
}
