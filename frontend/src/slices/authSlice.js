import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  threadID: null,
  user: {
    name: "",
    email: "",
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.threadID = action.payload.threadID;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.token = null;
      state.threadID = null;
      state.user = {name : "", email : ""};
    }
  }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;