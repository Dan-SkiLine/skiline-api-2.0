const express = require("express");
const https = require("https");
const morgan = require("morgan");
const routes = require("./routes.js");

const app = express();

app.use(morgan("tiny"));
app.use("/", routes);

app.listen(8080, function () {
  console.log("Skiline Search API listening on 8080");
});

module.exports = app;
