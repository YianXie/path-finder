import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    mui: ["@mui/material", "@mui/icons-material"],
                    router: ["react-router-dom"],
                    utils: ["axios", "jwt-decode"],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        target: "esnext",
        minify: "esbuild",
    },
    optimizeDeps: {
        include: ["react", "react-dom", "@mui/material", "@mui/icons-material"],
    },
});
