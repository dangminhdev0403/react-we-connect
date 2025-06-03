import { useEffect, useRef } from "react";

import { useSocket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import { debounce } from "lodash";

export function useSocketReceiver(refetchFn) {
  const socket = useSocket();

  const debouncedRefetch = useRef(
    debounce(() => {
      refetchFn?.();
    }, 1000)
  ).current;

  useEffect(() => {
    if (!socket) return;
    const messageHandler = (data) => {
      // Optionally handle message-specific logic here
      if (data?.from) {
        console.log("Message event received:", data);

        debouncedRefetch();
      }
    };

    const handler = (data) => {
      // Optionally handle friend request-specific logic here
      if (data?.from) {
        // For demonstration, log the event type
        console.log("Friend request event received:", data);
        debouncedRefetch();
      }
    };

    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_APPROVED, handler);
    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_DECLINED, handler);
    socket.on(EVENTS_SOCKET.SEND_FRIEND_REQUEST, handler); // 👈 thêm dòng này
    socket.on(EVENTS_SOCKET.MESSAGE_RECEIVED, messageHandler); // 👈 thêm dòng này

    return () => {
      socket.off(EVENTS_SOCKET.FRIEND_REQUEST_APPROVED, handler);
      debouncedRefetch.cancel();
      // messageHandler is not a debounced function, so no cancel method
    };
  }, [socket, debouncedRefetch]);
}
