const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const path = require("node:path");

module.exports = app => {
    app.use([
        "/acl-manager",
        "/admin-ng",
        "/api",
        "/info",
        "/services",
        "/staticfiles",
        "/sysinfo",
        "/ui",
    ], middleware);
};

const middleware = process.env.PROXY || process.env.PROXY_TARGET || process.env.PROXY_AUTH
    ? createProxyMiddleware({
        target: process.env.PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
        auth: process.env.PROXY_AUTH || "admin:opencast",
    })
    : (req, res, next) => {
        if (req.method === "POST") {
            res.status(201);
        }

        req.url = `/${req.method}${req.originalUrl}`;

        if (req.method !== "GET") {
            req.originalMethod = req.method;
            req.method = "GET";
            setTimeout(testFiles, 1000, req, res, next);
        } else {
            testFiles(req, res, next);
        }
    };

const testFiles = express.static(`${__dirname}/../../test/app`);
