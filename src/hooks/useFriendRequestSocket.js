import { useEffect, useRef } from "react";

import { useSocket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import { debounce } from "lodash";
import { toast } from "sonner";

export function useFriendRequestSocket(refetchFn) {
  const socket = useSocket();
  const requestCountRef = useRef(0);

  const debouncedRefetch = useRef(
    debounce(() => {
      refetchFn?.();
    }, 1000)
  ).current;

  const debouncedToast = useRef(
    debounce(() => {
      if (requestCountRef.current > 0) {
        toast.info(
          `🎉 You have ${requestCountRef.current} new friend request(s)!`,
          {
            duration: 1000,
            style: {
              background: "#0ea5e9",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }
        );
        requestCountRef.current = 0;
      }
    }, 1000)
  ).current;

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      if (data?.from) {
        requestCountRef.current += 1;
        debouncedToast();
        debouncedRefetch();
      }
    };

    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_RECEIVED, handler);

    return () => {
      socket.off(EVENTS_SOCKET.FRIEND_REQUEST_RECEIVED, handler);
      debouncedRefetch.cancel();
      debouncedToast.cancel();
    };
  }, [socket, debouncedRefetch, debouncedToast]);
}
