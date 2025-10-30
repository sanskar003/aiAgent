export default function LandingLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden font-amiamie-round">
      {/* Background gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-zinc-900 to-black animate-gradient-x" />

      {/* Loader Content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Pulse Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-red-500/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border-4 border-purple-500/40 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-teal-500 flex items-center justify-center shadow-lg">
            <img
              src="/images/logo.png"
              alt="Synthra"
              className="w-10 h-10 animate-bounce"
            />
          </div>
        </div>

        {/* Text */}
        <p className="mt-6 text-zinc-300 text-lg font-amiamie-round animate-pulse">
          Awakening Synthra...
        </p>
      </div>
    </div>
  );
}