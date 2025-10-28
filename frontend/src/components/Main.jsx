import { useSelector, useDispatch } from "react-redux";
import Threads from "./Threads";
import StarBorder from "./StarBorder";
import { createThread, setActiveThread } from "../slices/threadsSlice";

export default function Main() {
  const user = useSelector((state) => state.auth?.user?.name);
  const dispatch = useDispatch();

  const handelNewThread = () => {
    const action = createThread("New Thread");
    const result = dispatch(action);

    if (result.unwrap) {
      result.unwrap().then((thread) => {
        dispatch(setActiveThread(thread._id));
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full text-zinc-400 relative overflow-hidden px-4 sm:px-6 md:px-8">
      {/* Threads background */}
      <div className="absolute h-full w-full -z-10">
        <Threads amplitude={1} distance={0} enableMouseInteraction={false} />
      </div>

      <div className="relative flex flex-col justify-center items-center mt-6 sm:mt-10">
        {/* Logo */}
        <img
          className="max-w-[60vw] sm:max-w-[40vw] md:max-w-[25vw] z-10"
          src="/images/logo.png"
          alt="Synthra logo"
        />

        {/* AI interface animation */}
        <div className="absolute top-50 w-20 z-10">
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
          Welcome {user}
        </h1>

        <p className="mt-2 text-lg sm:text-xl text-zinc-300 font-amiamie-round">
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

        <div className="mt-6 flex flex-wrap gap-3 justify-center font-amiamie">
          <StarBorder
            as="button"
            className="custom-class hover:bg-red-400 cursor-pointer"
            color="red"
            speed="3s"
          >
            <span className="cursor-pointer" onClick={handelNewThread}>
              Start New Thread
            </span>
          </StarBorder>
        </div>
      </div>
    </div>
  );
}