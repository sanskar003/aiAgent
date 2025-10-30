import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThreads,
  createThread,
  deleteThread,
  renameThread,
  setActiveThread,
} from "../slices/threadsSlice.js";
import { openProfile } from "../slices/uiSlice.js";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const sidebarRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: threads, activeThreadId } = useSelector((state) => state.threads);
  const isAuthenticated = useSelector((state) => Boolean(state.auth.token));

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      x: collapsed ? "-105%" : "0%",
      duration: 0.4,
      ease: "power.out",
    });
  }, [collapsed]);

  return (
    <>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="fixed left-3 top-4 h-[95%] rounded-2xl w-64 md:w-80 lg:w-70 bg-black/50 backdrop-blur-md border-2 border-white/20 shadow-lg text-stone-200 flex flex-col z-20 overflow-hidden"
      >
        {/* Expanded content */}
        {!collapsed && (
          <>
            {/* Logo + Add icon */}
            <div className="px-3 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="font-amiamie-light-italic h-10 flex items-center">
                <img
                  className="w-17 h-17 mx-10"
                  src="/images/logo.png"
                  alt="synthra"
                />
              </div>
              <img
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  dispatch(createThread("New Thread"))
                    .unwrap()
                    .then((thread) => {
                      dispatch(setActiveThread(thread._id));
                      navigate("/chat");
                    });
                }}
                className="w-7 h-7 p-0.5 rounded-full hover:bg-red-500 cursor-pointer transition-all duration-300"
                src="/images/Sidebar-newAdd.png"
                alt="Add"
              />
            </div>

            {/* Threads list */}
            <div className="flex-1 text-sm overflow-y-auto px-3 py-3">
              <ul className="space-y-2 font-amiamie-round">
                {Array.isArray(threads) &&
                  threads.map((thread) => (
                    <li
                      key={thread._id}
                      onClick={() => dispatch(setActiveThread(thread._id))}
                      className={`px-3 py-1.5 rounded-2xl flex justify-between items-center ${
                        activeThreadId === thread._id
                          ? "bg-gradient-to-r from-red-500/30 to-purple-500/30 text-white border border-white/10"
                          : "bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex-1">
                        {editingId === thread._id ? (
                          <input
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={() => {
                              dispatch(renameThread({ id: thread._id, title: tempTitle }));
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                dispatch(renameThread({ id: thread._id, title: tempTitle }));
                                setEditingId(null);
                              }
                            }}
                            className="rounded-lg px-1"
                            autoFocus
                          />
                        ) : (
                          <span
                            onDoubleClick={() => {
                              setEditingId(thread._id);
                              setTempTitle(thread.title);
                            }}
                            className="truncate cursor-text"
                            title="Double-click to rename"
                          >
                            {thread.title}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === thread._id ? null : thread._id);
                          }}
                        >
                          <img
                            className="w-5 h-5 cursor-pointer"
                            src="/images/Sidebar-moreIcon.png"
                            alt="options"
                          />
                        </button>

                        {menuOpenId === thread._id && (
                          <div className="absolute right-0 mt-3 text-[0.8em] bg-stone-800 p-1 rounded-2xl z-10 w-25">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(thread._id);
                                setTempTitle(thread.title);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1 rounded-xl hover:bg-zinc-700"
                            >
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(deleteThread(thread._id));
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Profile icon */}
            <div className="border-t border-zinc-800 flex justify-end py-2 px-3">
              <img
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  dispatch(openProfile());
                }}
                className="w-8 h-8 bg-white/15 rounded-full p-1 hover:bg-red-500 cursor-pointer transition-all duration-300"
                src="/images/Sidebar-userIcon.png"
                alt="profile"
              />
            </div>
          </>
        )}
      </aside>

      {/* Toggle Icon (always visible) */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="fixed top-8 left-4 z-30 w-7 h-7  rounded-full flex items-center justify-center bg-red-500/60 hover:bg-white/20 border border-white/10 transition-all duration-300"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <img
          src="/images/Sidebar-collapseArrow.png"
          alt="toggle"
          className={`w-5 h-5 transition-transform duration-300 ${
            collapsed ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>
    </>
  );
}