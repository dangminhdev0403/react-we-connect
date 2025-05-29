import { UserPlus, X } from "lucide-react";

export default function FriendRequest() {
  const friendRequests = [
    { id: 1, name: "Nguyễn Văn A", mutualFriends: 5 },
    { id: 2, name: "Trần Thị B", mutualFriends: 12 },
    { id: 3, name: "Lê Văn C", mutualFriends: 3 },
    { id: 4, name: "Phạm Thị D", mutualFriends: 8 },
  ];

  const suggestedFriends = [
    { id: 5, name: "Hoàng Văn E", mutualFriends: 2 },
    { id: 6, name: "Vũ Thị F", mutualFriends: 7 },
    { id: 7, name: "Đặng Văn G", mutualFriends: 4 },
  ];

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
            <div key={request.id} className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {request.name}
                </p>
                <p className="text-xs text-gray-500">
                  {request.mutualFriends} bạn chung
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full">
                  <UserPlus size={14} />
                </button>
                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
                  <X size={14} />
                </button>
              </div>
            </div>
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
            <div key={friend.id} className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {friend.name}
                </p>
                <p className="text-xs text-gray-500">
                  {friend.mutualFriends} bạn chung
                </p>
              </div>
              <div className="flex items-center">
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full">
                  <UserPlus size={14} />
                </button>
              </div>
            </div>
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
