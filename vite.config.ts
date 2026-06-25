import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // proxy: {
    //   '/auth': {
    //     target: 'https://api.vieface.io.vn',
    //     changeOrigin: true,
    //   },
    //   '/users': {
    //     target: 'https://api.vieface.io.vn',
    //     changeOrigin: true,
    //   },
    //   '/chat': {
    //     target: 'https://api.vieface.io.vn',
    //     changeOrigin: true,
    //   },
    //   '/app-socket': {
    //     target: 'https://api.vieface.io.vn',
    //     changeOrigin: true,
    //   },
    // },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.VITE_BASE_PATH || "/",
});
