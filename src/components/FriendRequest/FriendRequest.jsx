import FriendRequestItem from "@components/FriendRequest/FriendRequestItem";
import { useFriendRequestSocket } from "@hooks/useFriendRequestSocket";
import {
  useGetFriendListQuery,
  useGetFriendRequestsQuery,
} from "@services/rootApi";

export default function FriendRequest() {
  const { data: result = [], refetch } = useGetFriendRequestsQuery();
  const friendRequests = result?.data?.users || [];
  const { data: friendListRes } = useGetFriendListQuery({
    offset: 1,
    limit: 10,
  });

  const friendList = friendListRes?.data?.friends ?? [];

  useFriendRequestSocket(refetch); // Hook xử lý socket & toast

  return (
    <div className="space-y-4">
      {/* Lời mời kết bạn */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-500 text-base">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-h-[80vh] flex flex-col group">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="font-semibold text-gray-500 text-base">Friend List</h2>
        </div>
        <div
          className="p-3 flex-1 min-h-0 overflow-hidden group-hover:overflow-y-scroll transition-all duration-200"
          style={{ scrollbarGutter: "stable" }}
        >
          {friendList.map((friend) => (
            <FriendRequestItem
              key={friend._id}
              friend={friend.friend}
              isRequest={false}
            />
          ))}
          {friendList.length === 0 && (
            <p className="text-center text-gray-500 py-8">No friends yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
