// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { createProxyMiddleware } = require("http-proxy-middleware");
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (app: any) {
	app.use(
		"/admin-ng/j_spring_security_check",
		createProxyMiddleware({
			target: "http://localhost:8080",
			changeOrigin: true,
		})
	);
	app.use(
		"/admin-ng/event/new/conflicts",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/admin-ng",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/acl-manager",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/i18n",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/i18n",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/blacklist",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/capture-agents",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/email",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/groups",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/info",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/roles",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/services",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/sysinfo",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/workflow",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/img",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/app/styles",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/staticfiles",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/public",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/modules",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/shared",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
	app.use(
		"/j_spring_security_check",
		createProxyMiddleware({
			target: "http://localhost:5000",
			changeOrigin: true,
		})
	);
};
