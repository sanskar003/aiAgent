import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth } from "./slices/authSlice.js";
import { setActiveThread } from "./slices/threadsSlice.js";
import { closeProfile, closeAbout } from "./slices/uiSlice.js";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatContainer from "./containers/ChatContainer.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Profile from "./components/Profile.jsx";
import About from "./components/About.jsx";
import Main from "./components/Main.jsx";
import LandingLoader from "./components/LandingLoader.jsx";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { activeThreadId } = useSelector((state) => state.threads);
  const { profileOpen, aboutOpen } = useSelector((state) => state.ui);

  const [rehydrated, setRehydrated] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Hide sidebar on login/register
  const hideSidebar = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    const savedThreadId = localStorage.getItem("activeThreadId");

    if (savedAuth) {
      try {
        const { token, user } = JSON.parse(savedAuth);
        if (token && user) {
          dispatch(setAuth({ token, user }));
          if (savedThreadId) {
            dispatch(setActiveThread(savedThreadId));
          }
        }
      } catch (err) {
        console.error("Failed to parse auth:", err);
        localStorage.removeItem("auth");
      }
    }

    setRehydrated(true);
  }, [dispatch]);

  const isAuthenticated = Boolean(token);
  const hasActiveThread = Boolean(activeThreadId);

  // Show loader if not rehydrated or in transition
  if (!rehydrated || transitioning) {
    return <LandingLoader />;
  }

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login setTransitioning={setTransitioning} />} />
          <Route path="/register" element={<Register setTransitioning={setTransitioning} />} />
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                hasActiveThread ? <ChatContainer /> : <Main />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>

      {profileOpen && <Profile onClose={() => dispatch(closeProfile())} />}
      {aboutOpen && <About onClose={() => dispatch(closeAbout())} />}
    </div>
  );
}