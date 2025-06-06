import { authSlice } from "@redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(authSlice.actions.logOut());
    navigate("/login", { replace: true });
  };

  return { logOut };
};
