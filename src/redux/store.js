import { logOutMiddleware } from "@redux/middleware";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { rootApi } from "@services/rootApi";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import dialogReducer from "./slices/dialogSlice";
import settingReducer from "./slices/settingSlice";
import snackbarReducer from "./slices/snackbarSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [rootApi.reducerPath, "snackbar"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    chat: chatReducer,
    setting: settingReducer,
    dialog: dialogReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(rootApi.middleware, logOutMiddleware),
});

export const persistor = persistStore(store);
