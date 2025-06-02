import FriendAvatar from "@components/Avatar/FriendAvatar";
import { useFriendRequestActions } from "@hooks/useFriendRequestActions";
import { chatSlice } from "@redux/slices/chatSlice";
import { User, UserPlus, X } from "lucide-react";
import { useDispatch } from "react-redux";

const FriendRequestItem = ({
  friend,
  requestId,
  refetch,
  isRequest = true,
}) => {
  const dispatch = useDispatch();
  const { isLoading, handleApproveFriendRequest, handleDeclineFriendRequest } =
    useFriendRequestActions(refetch);
  const showChatBox = (friend) => {
    console.log("friend", friend);

    dispatch(chatSlice.actions.openChatWith(friend));
  };
  return (
    <>
      {!isRequest ? (
        <button
          className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 mb-1 cursor-pointer w-full"
          onClick={() => {
            showChatBox(friend);
          }}
        >
          <div className="relative">
            <FriendAvatar />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-gray-900">
              {friend.name}
            </span>
            <p className="text-xs text-green-600 font-medium">Đang hoạt động</p>
          </div>
        </button>
      ) : (
        <div className="flex items-center gap-3 py-2 ">
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
            <button
              disabled={isLoading}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full cursor-pointer"
              onClick={() => handleApproveFriendRequest(requestId, friend._id)}
            >
              <UserPlus size={14} />
            </button>
            <button
              disabled={isLoading}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
              onClick={() => handleDeclineFriendRequest(requestId, friend._id)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendRequestItem;
