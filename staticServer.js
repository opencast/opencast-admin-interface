const path = require("path");
const express = require("express");

const app = express();

for (const method of ["post", "put", "delete"]) {
    app[method]("/*", (req, res, next) => {
        setTimeout(next, 1000);
    });
}

app.post("/*", (req, res, next) => {
    res.status(201);
    next();
});

app.use("/", [
    (req, res, next) => {
        req.url = `/${req.method}${req.url}`;
        req.method = "GET";
        next();
    },
    express.static(path.join(__dirname, "test/app"))
]);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listing on port ${port}`));
