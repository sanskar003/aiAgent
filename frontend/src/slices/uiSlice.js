import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileOpen: false,
  aboutOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openProfile: (state) => {
      state.profileOpen = true;
    },
    closeProfile: (state) => {
      state.profileOpen = false;
    },
    openAbout: (state) => {
      state.aboutOpen = true;
    },
    closeAbout: (state) => {
      state.aboutOpen = false;
    },
  },
});


export const { openProfile, closeProfile, openAbout, closeAbout } = uiSlice.actions;

export default uiSlice.reducer;
