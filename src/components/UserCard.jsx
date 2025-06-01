import { useFriendRequestActions } from "@hooks/useFriendRequestActions";
import { useFriendRequestResp } from "@hooks/useFriendRequestResp";
import { useFriendRequestSocket } from "@hooks/useFriendRequestSocket";
import {
  Cancel,
  LocationOn,
  MessageOutlined,
  Pending,
  People,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Button } from "@mui/material";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const UserCard = ({
  fullName = "Minh",
  requestStatus = "incoming",
  userId,
  refetch,
  requestId,
}) => {
  const {
    isLoading,
    handleSendFriendRequest,
    handleApproveFriendRequest,
    handleDeclineFriendRequest,
  } = useFriendRequestActions(refetch);

  useFriendRequestSocket(refetch); // Hook xử lý socket & toast
  useFriendRequestResp(refetch);

  const renderActions = () => {
    switch (requestStatus) {
      case "accepted":
        return (
          <Link to="/chat">
            <Button
              variant="contained"
              color="primary"
              startIcon={<MessageOutlined />}
              className="w-full"
            >
              Chat
            </Button>
          </Link>
        );

      case "pending":
        return (
          <Button
            variant="outlined"
            startIcon={<Pending />}
            disabled
            className="w-full"
          >
            Pending
          </Button>
        );

      case "incoming":
        return (
          <div className="flex gap-2 w-full">
            <LoadingButton
              variant="contained"
              color="success"
              startIcon={<Check />}
              className="flex-1"
              onClick={() => handleApproveFriendRequest(requestId, userId)}
              loading={isLoading}
              disabled={isLoading}
            >
              Approve
            </LoadingButton>
            <LoadingButton
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              className="flex-1"
              onClick={() => handleDeclineFriendRequest(requestId, userId)}
              loading={isLoading}
              disabled={isLoading}
            >
              Decline
            </LoadingButton>
          </div>
        );

      case "none":
      default:
        return (
          <LoadingButton
            onClick={() => handleSendFriendRequest(userId)}
            variant="outlined"
            color="primary"
            startIcon={<People />}
            className="w-full"
            disabled={isLoading}
            loading={isLoading}
          >
            Add Friend
          </LoadingButton>
        );
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: "2rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
            }}
          >
            {fullName?.[0]?.toUpperCase()}
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <Link className="block" to={"/Test"}>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform">
              {fullName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            @{fullName.toLowerCase()}_dev
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            <LocationOn sx={{ fontSize: 12 }} />
            Ho Chi Minh City
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
            <People sx={{ fontSize: 12 }} />
            12 mutual friends
          </div>
        </div>

        {/* Actions */}
        <div className="w-full pt-2">{renderActions()}</div>
      </div>

      {/* Decorative dots */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
    </div>
  );
};

export default UserCard;
