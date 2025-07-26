const express = require("express");
const app = express();

// app.use("/about/2", (req, res) => {
//   res.send("slowwww");
// });

app.get("/user", (req, res) => {
  res.send({ name: "Ameen", city: "ksd" });
});

app.post("/user", (req, res) => {
  res.send("data stored succesfully....");
});

app.delete("/user", (req, res) => {
  res.send("data deleted succesfully....");
});

app.use("/", (req, res) => {
  res.send("home Page Dev");
});

app.listen(7777, () => {
  console.log("app is listening to port 7777...");
});
