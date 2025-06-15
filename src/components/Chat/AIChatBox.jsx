import { useEffect, useRef, useState } from "react";

import { useSocket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@mui/material";
import { Bot, BotIcon, Loader2, Send, User } from "lucide-react";

export default function AIChatBox({
  title = "AI Chat Assistant",
  placeholder = "Nhập tin nhắn của bạn...",
  className = "",
}) {
  const [input, setInput] = useState("");

  // Gửi tin nhắn
  const socket = useSocket();
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { query: input, userId: "1" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Gửi tới server
    socket.emit(EVENTS_SOCKET.CHAT_BOX_QUERY, userMessage);
  };

  const [messages, setMessages] = useState([]);
  const currentAnswerRef = useRef("");
  const [isTyping, setIsTyping] = useState(false);

  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    socket.on(EVENTS_SOCKET.CHAT_BOX_RESPONSE, (data) => {
      console.log("data received >>:", data.text);

      currentAnswerRef.current += data.text;
      setIsTyping(true);
    });
    socket.on(EVENTS_SOCKET.CHAT_BOX_END, () => {
      setCurrentAnswer(currentAnswerRef.current);
      console.log("currentAnswer >>:", currentAnswerRef.current);

      setIsTyping(false);
    });
    return () => {
      socket.off(EVENTS_SOCKET.CHAT_BOX_RESPONSE);
      socket.off(EVENTS_SOCKET.CHAT_BOX_RESPONSE_END);
    };
  }, [socket]);

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="pb-3">
        <BotIcon className="w-5 h-5 text-blue-600" />
        {title}
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-4 py-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-blue-600/50" />
              <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 mt-1">
                  <div className="bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {typeof message.content === "object" &&
                  message.content !== null
                    ? message.content.text || JSON.stringify(message.content)
                    : message.content}
                </p>
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 mt-1">
                  <div className="bg-green-100">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 mt-1">
                <Avatar className="bg-blue-100">
                  <Bot className="w-4 h-4 text-blue-600" />
                </Avatar>
              </Avatar>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Đang soạn tin...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <div className="pt-3">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isTyping}
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isTyping || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
