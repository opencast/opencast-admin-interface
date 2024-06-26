import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";
import preserveDirectives from "rollup-preserve-directives";

export default defineConfig({
    base: process.env.PUBLIC_URL || "",
    plugins: [react(), svgr(), viteTsconfigPaths(), preserveDirectives()],
    build: {
        outDir: "build",
        sourcemap: true,
    },
    server: {
        open: true,
        port: Number(process.env.PORT) || 3000,
        proxy: {
            "^/(admin-ng|acl-manager|api|info|services|staticfiles|sysinfo|ui)/.*": {
                target: process.env.PROXY_TARGET || "https://develop.opencast.org",
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    const username = "admin";
                    const password = "opencast";
                    options.auth = process.env.PROXY_AUTH || `${username}:${password}`;
                },
            },
        },
    },
});
