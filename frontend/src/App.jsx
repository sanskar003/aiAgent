import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { activeThreadId } = useSelector((state) => state.threads);
  const { profileOpen, aboutOpen } = useSelector((state) => state.ui);
  const [rehydrated, setRehydrated] = useState(false);

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

  if (!rehydrated) return null;

  return (
    <>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Main/>} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected chat route */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? (
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  {hasActiveThread ? <ChatContainer /> : <Main />}
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* Global modals */}
      {profileOpen && <Profile onClose={() => dispatch(closeProfile())} />}
      {aboutOpen && <About onClose={() => dispatch(closeAbout())} />}
    </>
  );
}