const express = require("express");
const app = express();
app.listen(7777, () => {
  console.log("app is listening to port 7777...");
});

//------MIDDLEWARE--------
// const { adminAuth, uesrAuth } = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All Data sent...");
// });

// app.get("/admin/deleteAllData", (req, res) => {
//   res.send("Deleted all data");
// });

// app.get("/user/getAlldata", uesrAuth, (req, res) => {
//   res.send("user data sent");
// });

// app.post("/user/login", (req, res) => {
//   res.send("login sucussfull");
// });

app.get("/user", (req, res, next) => {
  throw new Error("erorororor");
  res.send("helo");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrond!!!!");
  }
});
