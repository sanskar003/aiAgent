import { useSelector, useDispatch } from "react-redux";
import ColorBends from "./ColorBends";
import StarBorder from "./StarBorder";
import { createThread, setActiveThread } from "../slices/threadsSlice";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const user = useSelector((state) => state.auth?.user?.name);
  const isAuthenticated = useSelector((state) => Boolean(state.auth.token));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getTimeGreeting();

  const handleNewThread = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const thread = await dispatch(createThread("New Thread")).unwrap();
      dispatch(setActiveThread(thread._id));
      navigate("/chat");
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-zinc-400 relative overflow-hidden px-4 sm:px-6 md:px-8">
      <div className="absolute  inset-0 z-10 ">
        <ColorBends
          colors={["#b2222"]}
          rotation={0}
          speed={0.3}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.3}
          parallax={0.5}
          noise={0.1}
          transparent={true}
        />
      </div>

      <div className="relative flex flex-col justify-center items-center mt-6 sm:mt-10 md:mt-10 lg:mt-0">
        {/* Logo */}
        <img
          className="max-w-[60vw] sm:max-w-[40vw] md:max-w-[30vw] lg:max-w-[25vw] z-10"
          src="/images/logo.png"
          alt="Synthra logo"
        />

        {/* AI interface animation */}
        <div className="absolute top-30 sm:top-30 md:top-35 lg:top-53 w-10 sm:w-10 md:w-10 lg:w-20 z-10">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse z-0" />
          <div className="bg-white/10 backdrop-blur-sm rounded-tr-full rounded-bl-full relative z-10">
            <div className="rotate-90 bg-red-500/35 backdrop-blur-sm rounded-tr-full rounded-bl-full">
              <img
                className="rotate-90"
                src="/images/aiInterface.gif"
                alt="lets CHAT"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome block */}
      <div className="text-center max-w-xl w-full px-4 sm:px-6 z-10">
        <h1 className="text-3xl sm:text-4xl font-amiamie-round text-stone-100">
          {greeting}, {user || "Explorer"}
        </h1>

        <p className="mt-6 sm:mt-5 md:mt-5 lg:mt-5 text-lg sm:text-xl text-zinc-300 font-amiamie-round">
          A space where your questions spark conversations with an{" "}
          <span className="bg-gradient-to-r from-teal-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
            intelligent chat agent
          </span>
          , and every idea finds its thread.
        </p>

        <p className="mt-6 text-sm text-zinc-500 font-amiamie">
          Start a new thread or continue where you left off — Synthra, your AI
          companion, remembers the flow.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center font-amiamie">
          <StarBorder
            as="button"
            className="custom-class cursor-pointer"
            color="red"
            speed="3s"
          >
            <span className="cursor-pointer" onClick={handleNewThread}>
              Start New Thread
            </span>
          </StarBorder>
        </div>
      </div>
    </div>
  );
}
