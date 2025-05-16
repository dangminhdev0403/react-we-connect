import { Alert, Snackbar } from "@mui/material";
import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  // Mô phỏng trạng thái snackbar tĩnh
  const [open, setOpen] = useState(true);
  const type = "success"; // Có thể là "error", "info", "warning", v.v.
  const message = "This is a static snackbar message";

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RootLayout;
