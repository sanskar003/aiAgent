import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap/all";
import About from "../components/About";

export default function Profile({ onClose }) {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popupRef = useRef();
  const [isOpenAbout, setIsOpenAbout] = useState(false);

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
    <>
      {/* Profile drawer (right side) */}
      <div className="fixed top-25 right-3 w-[20vw] bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          ref={popupRef}
          className="bg-zinc-900 text-white rounded-xl p-6 w-[22rem] shadow-xl border border-zinc-700 relative"
        >
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

          <div className="my-5 font-amiamie-round">
            <p className="text-lg">{user?.name || "Anonymous"}</p>
            <p className="text-sm text-zinc-400">{user?.email || "No email"}</p>
          </div>

          <div className="flex justify-between gap-2 mt-2 items-center">
            <p
              onClick={() => setIsOpenAbout(true)}
              className="border w-full p-1 rounded-full hover:border-zinc-700 hover:bg-zinc-700 duration-300 cursor-pointer"
            >
              <img
                className="w-5 h-5 m-auto hover:scale-90"
                src="/images/ProfileAbout.png"
                alt="about"
              />
            </p>

            <p className="border w-full p-1 rounded-full hover:border-zinc-700 hover:bg-zinc-700 duration-300 cursor-pointer">
              <img
                className="w-5 h-5 m-auto hover:scale-90"
                src="/images/ProfileSetting.png"
                alt="settings"
              />
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="relative flex items-center mt-3 rounded-full w-full p-1 border border-red-500 hover:bg-red-700 cursor-pointer transition-all duration-300"
          >
            <p className="m-auto font-amiamie">sign out</p>
            <img
              className="absolute right-1 w-6 h-6 hover:scale-90"
              src="/images/LogoutIcon.png"
              alt="logout"
            />
          </button>
        </div>
      </div>

      {/* About modal rendered separately, centered on screen */}
      {isOpenAbout && <About onClose={() => setIsOpenAbout(false)} />}
    </>
  );
}