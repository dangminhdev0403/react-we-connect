import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    id: "",
    name: "",
    email: "",
  },
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;

      if (action.payload.user) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      }
    },
    logOut: () => initialState, // ✅ trả lại initial state

    updateProfile: (state, action) => {
      state.user = action.payload;
    },
  },
});

export default authSlice.reducer;
