import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths(), tailwindcss()],
  server: {
    allowedHosts: ["0db8-42-113-152-212.ngrok-free.app"], // ✅ Thêm dòng này
  },
});
