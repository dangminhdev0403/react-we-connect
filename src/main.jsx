import { lazy } from "react";

import Dialog from "@components/Dialog";
import { ThemeProvider } from "@mui/material";
import AuthLayout from "@pages/auth/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ProtectedLayout from "@pages/ProtectedLayout";
import RootLayout from "@pages/RootLayout";
import SearchUserPage from "@pages/SearchUserPage";
import { persistor, store } from "@redux/store";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

import theme from "./configs/muiConfig";

import "./index.css";
const HomePage = lazy(() => import("@pages/HomePage"));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/search/users",
            element: <SearchUserPage />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/verify-otp",
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <Dialog />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "text-base font-semibold",
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
