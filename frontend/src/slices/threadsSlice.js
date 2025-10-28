import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");

// 🔹 Fetch all threads
export const fetchThreads = createAsyncThunk(
  "threads/fetch",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.get(`${BASE_URL}/threads`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// 🔹 Create a new thread
export const createThread = createAsyncThunk(
  "threads/create",
  async (title, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.post(
      `${BASE_URL}/threads`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// 🔹 Delete a thread
export const deleteThread = createAsyncThunk(
  "threads/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    await axios.delete(`${BASE_URL}/threads/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// 🔹 Rename a thread
export const renameThread = createAsyncThunk(
  "threads/rename",
  async ({ id, title }, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.put(
      `${BASE_URL}/threads/${id}`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

const threadsSlice = createSlice({
  name: "threads",
  initialState: {
    items: [],
    activeThreadId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveThread(state, action) {
      state.activeThreadId = action.payload;
      localStorage.setItem("activeThreadId", action.payload); // ✅ persist manually selected thread
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch threads
      .addCase(fetchThreads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // 🔹 Create thread
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.activeThreadId = action.payload._id;
        localStorage.setItem("activeThreadId", action.payload._id); // ✅ persist auto-selected thread
      })

      // 🔹 Delete thread
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
        if (state.activeThreadId === action.payload) {
          state.activeThreadId = null;
          localStorage.removeItem("activeThreadId"); // ✅ clear if deleted
        }
      })

      // 🔹 Rename thread
      .addCase(renameThread.fulfilled, (state, action) => {
        const updated = action.payload;
        const thread = state.items.find((t) => t._id === updated._id);
        if (thread) {
          thread.title = updated.title;
        }
      });
  },
});

export const { setActiveThread } = threadsSlice.actions;
export default threadsSlice.reducer;
