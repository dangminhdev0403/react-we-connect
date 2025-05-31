import FriendRequestItem from "@components/FriendRequest/FriendRequestItem";
import { socket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import { useGetFriendRequestsQuery } from "@services/rootApi";
import { useEffect } from "react";

export default function FriendRequest() {
  const { data: result = [], refetch } = useGetFriendRequestsQuery();

  const friendRequests = result?.data?.users || [];

  const suggestedFriends = [
    { id: 5, name: "Hoàng Văn E", mutualFriends: 2 },
    { id: 6, name: "Vũ Thị F", mutualFriends: 7 },
    { id: 7, name: "Đặng Văn G", mutualFriends: 4 },
  ];

  useEffect(() => {
    console.log("Đang đăng ký listener cho friendRequestReceived");

    socket.on(EVENTS_SOCKET.FRIEND_REQUEST_RECEIVED, (data) => {
      if (data.from) {
        refetch();
      }
    });

    return () => {
      socket.off(EVENTS_SOCKET.FRIEND_REQUEST_RECEIVED);
    };
  }, [refetch]);

  return (
    <div className="space-y-4">
      {/* Lời mời kết bạn */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-base">
            Lời mời kết bạn
          </h2>
        </div>
        <div className="p-3">
          {friendRequests.map((request) => (
            <FriendRequestItem
              key={request.senderInfo._id}
              friend={request.senderInfo}
            />
          ))}
        </div>
      </div>

      {/* Có thể bạn biết */}
      <div className="bg-white rounded-lg shadow-sm border  border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-base">
            Có thể bạn biết
          </h2>
        </div>
        <div className="p-3">
          {suggestedFriends.map((friend) => (
            <FriendRequestItem key={friend.id} friend={friend} />
          ))}
        </div>
      </div>

      {/* Bạn bè đang online */}
      <div className="bg-white rounded-lg shadow-sm border  border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-base">
            Bạn bè đang online
          </h2>
        </div>
        <div className="p-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-sm text-gray-900 font-medium">
                Bạn bè {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
