const { createProxyMiddleware } = require("http-proxy-middleware");

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
            target: "http://localhost:5000",
            changeOrigin: true,
        }),
    );
};
