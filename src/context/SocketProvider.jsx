import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  autoConnect: false,
});

const SocketContext = React.createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModelContext = () => {
  return useContext(SocketContext);
};
const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.accessToken);
  useEffect(() => {
    if (!token) return;
    socket.auth = { token };
    console.log("🔐 Socket token:", token);

    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [token]);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
