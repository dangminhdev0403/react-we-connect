import Header from "@pages/Header";
import { authSlice } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { data, isLoading, isFetching, isSuccess } = useGetAuthUserQuery();
  const dispath = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispath(authSlice.actions.updateProfile(data.data));
    }
  }, [data?.data, isSuccess, dispath]);
  if (isLoading || isFetching) {
    // Có thể return loading UI ở đây
    return <p>Đang tải...</p>;
  }

  // if (isSuccess && !data?.data.name) {
  //   return <Navigate to="/login" replace />;
  // }
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
