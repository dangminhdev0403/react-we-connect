import FriendRequestItem from "@components/FriendRequest/FriendRequestItem";
import { useFriendRequestSocket } from "@hooks/useFriendRequestSocket";
import { useGetFriendRequestsQuery } from "@services/rootApi";

export default function FriendRequest() {
  const { data: result = [], refetch } = useGetFriendRequestsQuery();
  const friendRequests = result?.data?.users || [];

  useFriendRequestSocket(refetch); // Hook xử lý socket & toast

  return (
    <div className="space-y-4">
      {/* Lời mời kết bạn */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-base">
            Friend Request
          </h2>
        </div>
        <div className="p-3">
          {friendRequests.length === 0 && (
            <p className="text-center text-gray-500">Not friend request </p>
          )}
          {friendRequests.map((request) => (
            <FriendRequestItem
              key={request.senderInfo._id}
              friend={request.senderInfo}
              requestId={request.requestId}
              refetch={refetch}
            />
          ))}
        </div>
      </div>

      {/* Bạn bè đang online */}
      <div className="bg-white rounded-lg shadow-sm border  border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-base">Friend List</h2>
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
