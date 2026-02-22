import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.jpg", "robots.txt", "offline.html"],
      manifest: {
        name: "Asliddin Logistic",
        short_name: "Asliddin Logistic",
        description: "Xalqaro logistikani 0 darajadan dispetcherlik darajasigacha AI yordamida o'rganing",
        theme_color: "#2563eb",
        background_color: "#1e293b",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/favicon.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any" },
          { src: "/favicon.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any maskable" },
        ],
        categories: ["education", "productivity"],
        lang: "uz",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,jpg,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "gstatic-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
      devOptions: { enabled: true },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
}));
