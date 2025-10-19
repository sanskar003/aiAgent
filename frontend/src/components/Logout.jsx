// components/Logout.jsx
import { useDispatch } from "react-redux";
import { clearAuth } from "../slices/authSlice";
import { clearMessages } from "../slices/chatSlice";

export default function Logout() {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(clearAuth());           // ✅ reset Redux auth
    localStorage.removeItem("auth"); // ✅ clear persisted login
    dispatch(clearMessages());       // ✅ clear chat history
  }

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md"
    >
      Logout
    </button>
  );
}