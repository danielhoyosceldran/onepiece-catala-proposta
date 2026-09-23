import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globPatterns: [],
        navigateFallback: null,
        runtimeCaching: [],
      },
      manifest: {
        name: "One Piece Catalonia",
        short_name: "One Piece Cat",
        description: "Mapa interactiu de One Piece en catala",
        lang: "ca",
        start_url: "/",
        display: "standalone",
        background_color: "#071427",
        theme_color: "#071427",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
