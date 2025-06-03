import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openChats: [], // [{ user: {...}, messages: [...] }]
  currentChatUser: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChatWith(state, action) {
      const userId = action.payload._id.toString();

      const exists = state.openChats?.find(
        (chat) => chat.user._id.toString() === userId
      );

      if (!exists) {
        // Nếu chưa tồn tại, thêm vào danh sách và mặc định không minimize
        state.openChats.push({ user: action.payload, isMinized: false });
      } else {
        // Nếu đã tồn tại, mở lại chat nếu đang minimize
        exists.isMinized = !exists.isMinized;
      }

      state.currentChatUser = action.payload;
    },
    closeChat(state, action) {
      state.openChats = state.openChats.filter(
        (chat) => chat.user._id !== action.payload
      );
    },
    toggleMinimizeChat(state, action) {
      const chat = state.openChats.find(
        (chat) => chat.user._id === action.payload
      );
      if (chat) {
        chat.isMinized = !chat.isMinized;
      }
    },
  },
});

export default chatSlice.reducer;
