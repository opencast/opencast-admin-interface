const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		[
			"/admin-ng",
			"/acl-manager",
			"/i18n",
			"/blacklist",
			"/capture-agents",
			"/email",
			"/groups",
			"/info",
			"/roles",
			"/services",
			"/sysinfo",
			"/workflow",
			"/img",
			"/app/styles",
			"/staticfiles",
			"/public",
			"/modules",
			"/shared",
			"/j_spring_security_check",
		],
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
};
