import Orb from "../components/Orb";

export default function LandingLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden font-amiamie-round">
      {/* Background gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-zinc-900 to-black animate-gradient-x" />

      {/* Centered Orb with glass effect */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-40 h-40 rounded-full  shadow-xl flex items-center justify-center">
          <div className="bg-white/10 w-20 h-20 rounded-full backdrop-blur-md absolute">
            <img src="/images/aiInterface.gif" alt="synthra" />
          </div>
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        {/* Text */}
        <p className="mt-6 text-zinc-300 text-lg font-amiamie-round animate-pulse">
          Awakening Synthra
        </p>
      </div>
    </div>
  );
}
