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
    //     target: 'http://100.120.5.8:30940',
    //     changeOrigin: true,
    //   },
    //   '/users': {
    //     target: 'http://100.120.5.8:30940',
    //     changeOrigin: true,
    //   },
    //   '/chat': {
    //     target: 'http://100.120.5.8:30940',
    //     changeOrigin: true,
    //   },
    //   '/app-socket': {
    //     target: 'http://100.120.5.8:30940',
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
});
