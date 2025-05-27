import { Alert, Snackbar } from "@mui/material";
import { closeSnackbar } from "@redux/slices/snackbarSlice";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { open, type, message } = useSelector((state) => state.snackbar);
  const dispath = useDispatch();
  return (
    <div className="text-gray-700">
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => {
          dispath(closeSnackbar());
        }}
      >
        <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RootLayout;
