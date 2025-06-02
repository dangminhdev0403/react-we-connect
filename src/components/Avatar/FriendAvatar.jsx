import { User } from "lucide-react";

const FriendAvatar = ({ isOnline = true }) => {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-gray-600" />
      </div>
      {isOnline && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
      )}
    </div>
  );
};

export default FriendAvatar;
