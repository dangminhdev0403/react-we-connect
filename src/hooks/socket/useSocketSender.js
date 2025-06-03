// hooks/useSocketSender.js
import { useSocket } from "@context/SocketProvider";
import { EVENTS_SOCKET } from "@libs/constants";
import { useSendSingleMessageMutation } from "@services/rootApi";
export const useSocketSender = () => {
  // Lấy trigger và trạng thái mutation
  const [sendSingleMessage] = useSendSingleMessageMutation();
  const socket = useSocket();

  // Hàm gửi message qua API và socket
  const sendMessage = async (dataForm) => {
    try {
      await sendSingleMessage(dataForm).unwrap();
      const receiverId = dataForm.get("receiverId"); // ✅ Đúng cách
      console.log("receiverId", receiverId, typeof receiverId); // nên là string

      socket.emit(EVENTS_SOCKET.SEND_MESSAGE, { receiverId });
      console.log("Message sent successfully to " + dataForm.get("receiverId"));
    } catch (err) {
      console.error("Failed to send message:", err);
      throw err;
    }
  };

  // Hàm gửi sự kiện typing
  const sendTyping = ({ to }) => {
    socket.emit("typing", { to });
  };

  // Hàm gửi sự kiện đã xem message
  const sendSeen = ({ messageId, to }) => {
    socket.emit("seen", { messageId, to });
  };

  // Trả về hàm trigger và trạng thái mutation
  return {
    sendMessage,
    sendTyping,
    sendSeen,
  };
};
