import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";
import preserveDirectives from "rollup-preserve-directives";
import child from "child_process";

const commitHash = child.execSync("git rev-parse HEAD").toString().trim();

export default defineConfig({
    base: process.env.PUBLIC_URL || "",
    plugins: [react(), svgr(), viteTsconfigPaths(), preserveDirectives()],
    define: {
        'import.meta.env.VITE_GIT_COMMIT_HASH': JSON.stringify(commitHash),
        'import.meta.env.VITE_APP_BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
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
