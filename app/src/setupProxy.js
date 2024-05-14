const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
    app.use(
        [
            "/acl-manager",
            "/admin-ng",
            "/api",
            "/info",
            "/services",
            "/staticfiles",
            "/sysinfo",
            "/ui",
        ],
        createProxyMiddleware({
            target: process.env.PROXY_TARGET || "http://localhost:8080",
            changeOrigin: true,
            auth: process.env.PROXY_AUTH || "admin:opencast",
        }),
    );
};
