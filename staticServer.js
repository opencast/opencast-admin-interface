const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/*", express.static(path.join(__dirname, "test/app/GET")));

app.post("/*", (req, res, next) => {
    res.status(201);
    next();
});

const serveStatic = (req, res) => {
    const filePath = path.join(__dirname, "test/app", req.method.toUpperCase(), req.url);
    setTimeout(() => {
        res.sendFile(filePath);
    }, 1000);
};

for (const method of ["put", "post", "delete"]) {
    app[method]("/*", serveStatic);
}

app.listen(port, () => console.log(`Listing on port ${port}`));
