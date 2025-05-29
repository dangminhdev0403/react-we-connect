import dayjs from "dayjs";
import { Heart, MessageCircle, User } from "lucide-react";

const Post = ({
  fullName = "Admin",
  createdAt = new Date(),
  content = "Test",
  image = null,
  like = 0,
  comments = 0,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto mb-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{fullName}</h3>
          <p className="text-sm text-gray-500">
            {dayjs(createdAt).format("HH:mm • DD/MM/YYYY")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed text-base">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt="Post content"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-gray-600 mb-4 py-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-current" />
            </div>
            <span className="text-sm font-medium">{like}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{comments} comments</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-400 pt-3">
        <div className="flex gap-2">
          <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
            <Heart className="w-5 h-5" />
            <span>Like</span>
          </button>
          <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
