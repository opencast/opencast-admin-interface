const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
    app.use(
        [
            "/api",
            "/admin-ng",
            "/acl-manager",
            "/info",
            "/services",
            "/sysinfo",
            "/staticfiles",
            "/ui",
        ],
        createProxyMiddleware({
            target: process.env.PROXY_TARGET || "http://localhost:8080",
            changeOrigin: true,
            auth: process.env.PROXY_AUTH || "admin:opencast",
        }),
    );
};
