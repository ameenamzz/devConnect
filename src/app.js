const express = require("express");
const app = express();

// app.use("/about/2", (req, res) => {
//   res.send("slowwww");
// });

app.use(
  "/user",
  (req, res, next) => {
    console.log("1st route handler.");
    next();
    // res.send("1st Response...");
  },
  (req, res) => {
    console.log("2nd Router handler.");
    res.send("2nd Response... ");
  }
);

app.listen(7777, () => {
  console.log("app is listening to port 7777...");
});
