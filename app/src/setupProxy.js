const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PROXY_PORT || 5000;

module.exports = function (app) {
    app.use(
        [
            "/api",
            "/admin-ng",
            "/acl-manager",
            "/info",
            "/services",
            "/sysinfo",
            "/staticfiles",
            "/j_spring_security_check",
            "/ui",
        ],
        createProxyMiddleware({
            target: `http://localhost:${port}`,
            changeOrigin: true,
        }),
    );
};
