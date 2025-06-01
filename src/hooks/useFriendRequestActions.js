import { useState } from "react";

import { useSocket } from "@context/SocketProvider";
import { useDebouncedToast } from "@hooks/useDebouncedToast";
import { EVENTS_SOCKET } from "@libs/constants";
import {
  useApproveFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@services/rootApi";

export function useFriendRequestActions(refetch) {
  const socket = useSocket();

  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [approveFriendRequest] = useApproveFriendRequestMutation();
  const [declineFriendRequest] = useDeclineFriendRequestMutation();
  const debouncedToast = useDebouncedToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleSendFriendRequest = async (receiverId) => {
    setIsLoading(true);
    try {
      await sendFriendRequest(receiverId).unwrap();
      socket.emit(EVENTS_SOCKET.SEND_FRIEND_REQUEST, { receiverId });
      refetch && refetch();
      debouncedToast("✅ Friend request sent", "#0ea5e9");
    } catch (error) {
      console.error("Send friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveFriendRequest = async (requestId, receiverId) => {
    setIsLoading(true);
    try {
      await approveFriendRequest(requestId).unwrap();
      socket.emit(EVENTS_SOCKET.FRIEND_REQUEST_APPROVED, { receiverId });
      debouncedToast("✅ Request approved", "#22c55e");

      refetch && refetch();
    } catch (error) {
      console.error("Approve friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineFriendRequest = async (requestId, receiverId) => {
    setIsLoading(true);
    try {
      await declineFriendRequest(requestId).unwrap();
      socket.emit(EVENTS_SOCKET.FRIEND_REQUEST_DECLINED, { receiverId });
      debouncedToast("❌ Request declined", "#ef4444");

      refetch && refetch();
    } catch (error) {
      console.error("Decline friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSendFriendRequest,
    handleApproveFriendRequest,
    handleDeclineFriendRequest,
  };
}
