import { useEffect, useRef } from "react";

import { useSocket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import { debounce } from "lodash";

export function useFriendRequestResp(refetchFn) {
  const socket = useSocket();

  const debouncedRefetch = useRef(
    debounce(() => {
      refetchFn?.();
    }, 1000)
  ).current;

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      if (data?.from) {
        debouncedRefetch();
      }
    };

    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_APPROVED, handler);
    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_DECLINED, handler);
    socket.on(EVENTS_SOCKET.SEND_FRIEND_REQUEST, handler); // 👈 thêm dòng này

    return () => {
      socket.off(EVENTS_SOCKET.FRIEND_REQUEST_APPROVED, handler);
      socket.off(EVENTS_SOCKET.FRIEND_REQUEST_DECLINED, handler);
      socket.off(EVENTS_SOCKET.SEND_FRIEND_REQUEST, handler); // 👈 thêm dòng này

      debouncedRefetch.cancel();
    };
  }, [socket, debouncedRefetch]);
}
