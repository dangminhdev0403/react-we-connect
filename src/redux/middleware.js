import { authSlice } from "@redux/slices/authSlice";
import { persistor } from "@redux/store";
import { rootApi } from "@services/rootApi";

export const logOutMiddleware = (store) => (next) => (action) => {
  if (action.type === authSlice.actions.logOut.type) {
    store.dispatch(rootApi.util.resetApiState());
    persistor.purge();
  }
  return next(action);
};
