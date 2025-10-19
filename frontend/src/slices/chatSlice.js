import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [] },
  reducers: {
    setMessages(state, action) {
      state.messages = Array.isArray(action.payload) ? action.payload : [];
    },
    addMessages: (state, action) => {
      const newMessages = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.messages = [...state.messages, ...newMessages]; // ✅ append
    },
    prependMessages: (state, action) => {
      const olderMessages = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.messages = [...olderMessages, ...state.messages]; // ✅ prepend
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessages, clearMessages, prependMessages } = chatSlice.actions;
export default chatSlice.reducer;
