import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  title: null,
  dialogType: null, // ✅ ví dụ: "postCreation", "deleteConfirmation", ...
  maxWidth: "md",
  fullWidth: true,
  dialogProps: {}, // 👈 chứa thông tin phụ nếu cần
  additionalProps: {},
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state, action) => {
      const { dialogType, title, dialogProps = {}, ...rest } = action.payload;

      state.open = true;
      state.dialogType = dialogType;
      state.title = title;
      state.dialogProps = dialogProps;
      Object.assign(state, rest);
    },
    closeDialog: () => initialState,
  },
});

export default dialogSlice.reducer; // dòng này mới là export mặc định
