const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(
    "/admin-ng",
    express.static(path.join(__dirname, "test/app/GET/admin-ng"))
);
app.use(
    "/acl-manager",
    express.static(path.join(__dirname, "test/app/GET/acl-manager"))
);
app.use(
    "/info",
    express.static(path.join(__dirname, "test/app/GET/info"))
);
app.use(
    "/services",
    express.static(path.join(__dirname, "test/app/GET/services"))
);
app.use(
    "/sysinfo",
    express.static(path.join(__dirname, "test/app/GET/sysinfo"))
);
// TODO
app.use("/staticfiles",
    express.static(path.join(__dirname, "test/app/POST"))
);

app.post("/*", (req, res) => {
    let filePath = path.join(__dirname,'test/app/' + req.method + req.url);
    setTimeout(function () {
        res.status(201);
        res.sendFile(filePath);
    }, 1000);

});

app.delete("/*", (req, res) => {
    let filePath = path.join(__dirname, 'test/app/' + req.method + req.url);
    setTimeout(function() {
        res.sendFile(filePath);
    }, 1000);
});

app.put("/*", (req, res) => {
    let filePath = path.join(__dirname, 'test/app/' + req.method + req.url);
    setTimeout(function () {
        res.sendFile(filePath);
    }, 1000);
});

app.listen(port, () => console.log(`Listing on port ${port}`));

