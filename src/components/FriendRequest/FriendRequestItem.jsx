import { User, UserPlus, X } from "lucide-react";

const FriendRequestItem = ({ friend }) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
        <User className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {friend.name}
        </p>
        <p className="text-xs text-gray-500">0 bạn chung</p>
      </div>
      <div className="flex flex-col gap-1">
        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full cursor-pointer">
          <UserPlus size={14} />
        </button>
        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestItem;
