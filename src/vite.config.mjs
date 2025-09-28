import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: ".",
    base: "/build/",
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],
            refresh: true,
        }),
        react({
            // React Fast Refreshを有効化
            fastRefresh: true,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
    server: {
        host: "localhost",
        port: 5173,
        hmr: {
            host: "localhost",
            port: 5173,
        },
        watch: {
            usePolling: true,
            interval: 1000,
        },
        strictPort: true,
    },
    optimizeDeps: {
        include: ["@inertiajs/react"],
    },
    build: {
        outDir: "public/build",
        manifest: true,
        rollupOptions: {
            input: "resources/js/app.jsx",
        },
        emptyOutDir: true,
    },
});
