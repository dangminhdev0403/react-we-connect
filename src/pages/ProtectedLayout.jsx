import SocketProvider from "@context/SocketProvider";
import Header from "@pages/Header";
import { authSlice } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { data, isLoading, isFetching, isSuccess } = useGetAuthUserQuery();
  const dispath = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      dispath(authSlice.actions.updateProfile(data.data));
    }
  }, [data?.data, isSuccess, dispath]);
  if (isLoading || isFetching) {
    // Có thể return loading UI ở đây
    return <p>Đang tải...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <SocketProvider>
      <div>
        <Header />
        <div className="bg-[#f8f7fa]">
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};

export default ProtectedLayout;
