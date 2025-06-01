import React, { useContext, useEffect, useMemo, useRef } from "react";

import { useSelector } from "react-redux";
import { io } from "socket.io-client";

// Tạo Context
const SocketContext = React.createContext(null);

// Hook sử dụng context
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

// Provider
const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.accessToken);
  const socketRef = useRef(null);

  // Tạo socket chỉ 1 lần duy nhất
  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
      autoConnect: false,
      transports: ["websocket"], // tùy chọn nếu server hỗ trợ
    });
  }

  useEffect(() => {
    const socket = socketRef.current;

    if (!token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, [token]);

  const contextValue = useMemo(() => socketRef.current, []);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
