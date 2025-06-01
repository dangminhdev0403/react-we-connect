import { useRef } from "react";

import { debounce } from "lodash";
import { toast } from "sonner";

export function useDebouncedToast() {
  // Tạo debounce function 1 lần duy nhất
  const debouncedToastRef = useRef(
    debounce(({ message, color }) => {
      toast(message, {
        duration: 2000,
        style: {
          background: color || "#0ea5e9",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 16px",
        },
      });
    }, 1000)
  );

  // Wrapper để gọi debounce toast
  const showToast = (message, color) => {
    debouncedToastRef.current({ message, color });
  };

  return showToast;
}
