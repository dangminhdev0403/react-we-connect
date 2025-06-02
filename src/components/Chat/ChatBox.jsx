"use client";

import { useEffect, useRef, useState } from "react";

import { chatSlice } from "@redux/slices/chatSlice";
import {
  Check,
  CheckCheck,
  Minus,
  Phone,
  Send,
  Smile,
  Video,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";

export default function ChatBox({ user }) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Chào bạn! Bạn có rảnh không?",
      sender: "other",
      timestamp: "14:30",
      status: "read",
    },
    {
      id: 2,
      text: "Chào! Mình đang rảnh. Có chuyện gì vậy?",
      sender: "user",
      timestamp: "14:32",
      status: "read",
    },
    {
      id: 3,
      text: "Mình muốn hỏi về dự án tuần tới",
      sender: "other",
      timestamp: "14:33",
      status: "delivered",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleClose = () => {
    dispatch(chatSlice.actions.closeChat(user._id));
  };

  const renderStatus = (status) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

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
      <div className="h-[370px] overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs opacity-70">{message.timestamp}</span>
                {message.sender === "user" && renderStatus(message.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim()
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
