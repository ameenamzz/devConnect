const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("home Page Devconnect");
});

app.get("/about", (req, res) => {
  res.send("about Page");
});

app.listen(7777, () => {
  console.log("app is listening to port 7777...");
});
