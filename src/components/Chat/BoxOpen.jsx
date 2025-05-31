import { MessageCircle } from "lucide-react";

const BoxOpen = ({ setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default BoxOpen;
