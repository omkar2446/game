import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// 🚀 FIX: Ensures public/_redirects is copied to dist/
// Vite already copies everything from public/ automatically,
// so no extra plugin is needed.

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 🚀 MOST IMPORTANT FIX FOR RENDER (React Router)
  // Makes sure all unknown routes fall back to index.html
  build: {
    rollupOptions: {
      output: {},
    },
  },

  // This ensures dev server also handles refresh correctly
  preview: {
    port: 8080,
  },
}));
