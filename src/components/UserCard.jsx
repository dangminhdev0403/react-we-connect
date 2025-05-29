import {
  LocationOn,
  MessageOutlined,
  People,
  PersonAdd,
} from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const UserCard = ({ isFriend = true, fullName = "Minh" }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Background gradient overlay - Blue tone only */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Avatar with glow */}
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

          {/* Online status */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* User info */}
        <div className="space-y-2">
          <Link className="block">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform">
              {fullName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            @{fullName.toLowerCase()}_dev
          </p>
        </div>

        {/* Badges - all blue tone */}
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

        {/* Action Button - consistent blue style */}
        <div className="w-full pt-2">
          {isFriend ? (
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "12px 24px",
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MessageOutlined sx={{ marginRight: 1, fontSize: 20 }} />
              Message
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                borderColor: "#3b82f6",
                color: "#3b82f6",
                borderWidth: "2px",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "12px 24px",
                "&:hover": {
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <PersonAdd sx={{ marginRight: 1, fontSize: 20 }} />
              Add Friend
            </Button>
          )}
        </div>
      </div>

      {/* Decorative dots */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
    </div>
  );
};

export default UserCard;
