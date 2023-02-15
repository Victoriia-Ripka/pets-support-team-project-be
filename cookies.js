const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", function (req, res) {
  res.cookie("myFisrstCookie", "looks good");
  res.end("wow");
});

app.get("/removeCookie", function (req, res) {
  res.clearCookie("myFisrstCookie");
  res.end("wow");
});

app.listen(2356, () => console.log("ok?"));
