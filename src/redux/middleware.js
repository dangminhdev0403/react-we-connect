import { authSlice } from "@redux/slices/authSlice";
import { persistor } from "@redux/store";

export const logOutMiddleware = () => (next) => (action) => {
  if (action.type === authSlice.actions.logOut.type) {
    // Clear the persisted state
    persistor.purge();
  }
  return next(action);
};
