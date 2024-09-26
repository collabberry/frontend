import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dynamicImport from "vite-plugin-dynamic-import";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros"],
      },
    }),
    nodePolyfills(),
    dynamicImport(),
  ],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  build: {
    outDir: "build",
  },
});
