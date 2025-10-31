import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../slices/authSlice";
import { openAbout } from "../slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap/all";

export default function Profile({ onClose }) {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popupRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      popupRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, { scope: popupRef });

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("auth");
    navigate("/login");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center px-4">
      <div className="relative">
        {/* Modal content */}
        <div
          ref={popupRef}
          className="relative z-10 bg-white/5 backdrop-blur-2xl text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[25vw] xl:max-w-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-zinc-700 overflow-y-auto max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <img
              className="w-4 h-4 cursor-pointer"
              src="/images/ProfileClose.png"
              alt="close"
            />
          </button>

          {/* User info */}
          <div className="my-5 font-amiamie-round text-center">
            <p className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {user?.name || "Anonymous"}
            </p>
            <p className="text-sm text-zinc-400">{user?.email || "No email"}</p>
          </div>

          {/* Action buttons: About + Sign Out side by side */}
          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={() => dispatch(openAbout())}
              className="flex-1 border border-zinc-600 p-2 rounded-full hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
            >
              <img
                className="w-5 h-5 m-auto hover:scale-90 transition-transform"
                src="/images/ProfileAbout.png"
                alt="about"
              />
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 relative border border-zinc-600 p-2 rounded-full hover:bg-red-500 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <p className="font-amiamie text-white text-md text-center">sign out</p>
              <img
                className="w-5 h-5 hidden md:block lg:block absolute right-2 hover:scale-90 transition-transform"
                src="/images/LogoutIcon.png"
                alt="logout"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}