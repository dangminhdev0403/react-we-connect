import MyAvatar from "@components/Avatar/MyAvatar";
import { chatSlice } from "@redux/slices/chatSlice";
import { useDispatch } from "react-redux";

const BoxOpen = ({ user }) => {
  const dispatch = useDispatch();
  const handleMinizeChat = (user) => {
    dispatch(chatSlice.actions.toggleMinimizeChat(user._id));
  };
  return (
    <MyAvatar
      name={user.name}
      width={65}
      height={65}
      handleUserMenuClick={() => handleMinizeChat(user)}
    />
  );
};

export default BoxOpen;
