import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowDrawer: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isShowDrawer = !state.isShowDrawer;
    },
  },
});

export default settingSlice.reducer;
