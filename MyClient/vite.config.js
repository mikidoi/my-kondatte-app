import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5109", // Using IP is safer on Mac
        changeOrigin: true,
        secure: false,
        // This ensures /api/weatherforecast stays /api/weatherforecast 
        // when it hits the C# server
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});