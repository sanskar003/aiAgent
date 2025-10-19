import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth } from "./slices/authSlice.js";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatContainer from "./containers/ChatContainer.jsx";
import Profile from "./components/Profile.jsx";

export default function App() {
  const dispatch = useDispatch();
  const { token, threadID, user } = useSelector((state) => state.auth);
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const { token, threadID, user } = JSON.parse(saved);
        if (token && threadID) {
          dispatch(setAuth({ token, threadID, user }));
        }
      } catch (err) {
        console.error("Failed to parse auth:", err);
        localStorage.removeItem("auth");
      }
    }
    setRehydrated(true);
  }, []);

  const isAuthenticated = token && threadID;

  if (!rehydrated) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with sidebar layout */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <div className="flex h-screen">
              {/* <Sidebar /> */}
              <div className="flex-1">
                <ChatContainer />
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
        <Route path="/profile" element={ isAuthenticated ? <Profile /> : <Navigate to="/login" /> }/>
    </Routes>
  );
}