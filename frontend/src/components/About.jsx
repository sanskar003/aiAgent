import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function About({ onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center px-4">
  <div className="relative">
    {/* Glowing pulse ring */}
    <div className="absolute inset-0 rounded-2xl bg-red-500/30 blur-xl animate-ping z-0" />

    {/* Modal content */}
    <div
      ref={modalRef}
      className="relative z-10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[40vw] xl:max-w-2xl shadow-2xl border border-zinc-700 max-h-[90vh] overflow-y-auto"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
      >
        <img
          className="w-4 h-4 cursor-pointer"
          src="/images/ProfileClose.png"
          alt="close"
        />
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        ChatMate
      </h2>

      {/* Info Sections */}
      <div className="space-y-6">
        {/* Functionality */}
        <div className="p-4 rounded-xl bg-white/5 border border-zinc-700 hover:border-red-500 transition">
          <h3 className="text-lg font-amiamie font-semibold text-blue-400 mb-2">⚡ Functionality</h3>
          <p className="text-zinc-300 font-light font-amiamie-round leading-tight">
            ChatMate helps you brainstorm, debug, generate content, and manage conversations with a sleek, modern interface. It’s designed for productivity and creativity, blending smooth animations with powerful AI responses.
          </p>
        </div>

        {/* Model */}
        <div className="p-4 rounded-xl bg-white/5 border border-zinc-700 hover:border-red-500 transition">
          <h3 className="text-lg font-amiamie font-semibold text-purple-400 mb-2">🧠 Model</h3>
          <p className="text-zinc-300 font-light font-amiamie-round leading-tight">
            Powered by <span className="font-medium text-white">OpenAI / gpt‑oss‑120b</span>, delivering advanced reasoning, natural conversation, and reliable performance.
          </p>
        </div>

        {/* Tools */}
        <div className="p-4 rounded-xl bg-white/5 border border-zinc-700 hover:border-red-500 transition">
          <h3 className="text-lg font-amiamie font-semibold text-green-400 mb-2">🛠 Tools</h3>
          <p className="text-zinc-300 font-light font-amiamie-round leading-tight">
            Integrated with <span className="font-medium text-white">Tavily Search</span> for real‑time knowledge and context‑aware answers.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}