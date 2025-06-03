import { useEffect, useMemo, useRef } from "react";

import { useSocketSender } from "@hooks/socket/useSocketSender";
import { useSocketReceiver } from "@hooks/useSocketReceiver";
import { chatSlice } from "@redux/slices/chatSlice";
import { useGetSimpleMessageQuery } from "@services/rootApi";
import dayjs from "dayjs";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Minus, Phone, Send, Smile, Video, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function ChatBox({ user }) {
  const offset = 1;
  const limit = 8;
  const receiverId = useMemo(() => user?._id, [user]);
  const senderId = useSelector((state) => state.auth.user.id);
  console.log("senderId", senderId);
  console.log("receiverId", receiverId);

  const { control, handleSubmit, reset, watch } = useForm();
  const { sendMessage } = useSocketSender();

  const { data, isLoading, refetch } = useGetSimpleMessageQuery({
    receiverId,
    offset,
    limit,
  });
  useSocketReceiver(refetch);
  const messageList = data?.data?.messages || [];

  const messageValue = watch("message") || "";

  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = (formData) => {
    const dataForm = new FormData();

    dataForm.append("content", formData.message);
    dataForm.append("receiverId", receiverId);

    sendMessage(dataForm);
    reset(); // Reset form sau khi gửi
  };

  const handleClose = () => {
    dispatch(chatSlice.actions.closeChat(user._id));
  };

  // const renderStatus = (status) => {
  //   switch (status) {
  //     case "sent":
  //       return <Check className="h-3 w-3 text-gray-400" />;
  //     case "delivered":
  //       return <CheckCheck className="h-3 w-3 text-gray-400" />;
  //     case "read":
  //       return <CheckCheck className="h-3 w-3 text-blue-500" />;
  //     default:
  //       return null;
  //   }
  // };

  const handleMinimazed = () => {
    dispatch(chatSlice.actions.toggleMinimizeChat(user._id));
  };
  return (
    <div className="w-80 bg-white rounded-lg shadow-xl z-50 h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            HG
          </div>
          <div>
            <h3 className="font-medium text-sm">{user.name}</h3>
            <p className="text-xs opacity-80">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <Video className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-white/20 rounded cursor-pointer"
            onClick={() => handleMinimazed()}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-white/20 rounded cursor-pointer"
            onClick={() => {
              handleClose();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className={` h-[370px] overflow-y-auto p-3 space-y-2 flex flex-col ${
          isLoading ? "justify-center" : "justify-end"
        } `}
      >
        {isLoading && (
          <div className="mt-6 flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-gray-200 "
            />
          </div>
        )}
        {messageList.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id.toString() === senderId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                message.sender._id.toString() === senderId
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs opacity-70">
                  {dayjs(message.createdAt).format("HH:mm DD/MM/YYYY")}
                </span>
                {/* {message.sender !== receiverId && renderStatus(message.status)} */}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSubmit(handleSendMessage)} className="flex gap-2">
          <Controller
            type="text"
            name="message"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />

          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!messageValue.trim()}
            className={`p-2 rounded-full transition-colors ${
              messageValue.trim()
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
