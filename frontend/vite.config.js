import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const backendUrl = process.env.VITE_BACKEND_URL || "http://192.168.1.69:5000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: isProd ? "https://your-backend-url.com" : backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
