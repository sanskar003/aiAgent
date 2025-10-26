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
      { scale: 0.8, opacity: 0 },
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
  <div
    ref={popupRef}
    className="bg-white/5 backdrop-blur-xl text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[25vw] xl:max-w-xl shadow-xl border border-zinc-700 relative overflow-y-auto max-h-[90vh]"
  >
    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center"
    >
      <img
        className="w-4 h-4 cursor-pointer"
        src="/images/ProfileClose.png"
        alt="close"
      />
    </button>

    {/* User info */}
    <div className="my-5 font-amiamie-round text-center">
      <p className="text-lg">{user?.name || "Anonymous"}</p>
      <p className="text-sm text-zinc-400">{user?.email || "No email"}</p>
    </div>

    {/* Action buttons */}
    <div className="flex justify-between gap-2 mt-2 items-center">
      <button
        onClick={() => dispatch(openAbout())}
        className="border w-full p-2 rounded-full hover:border-zinc-700 hover:bg-zinc-700 duration-300"
      >
        <img
          className="w-5 h-5 m-auto hover:scale-90"
          src="/images/ProfileAbout.png"
          alt="about"
        />
      </button>

      <button className="border w-full p-2 rounded-full hover:border-zinc-700 hover:bg-zinc-700 duration-300">
        <img
          className="w-5 h-5 m-auto hover:scale-90"
          src="/images/ProfileSetting.png"
          alt="settings"
        />
      </button>
    </div>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="relative flex items-center mt-4 rounded-full w-full p-2 border border-red-500 hover:bg-red-700 cursor-pointer transition-all duration-300"
    >
      <p className="m-auto font-amiamie">sign out</p>
      <img
        className="absolute right-2 w-6 h-6 hover:scale-90"
        src="/images/LogoutIcon.png"
        alt="logout"
      />
    </button>
  </div>
</div>
  );
}