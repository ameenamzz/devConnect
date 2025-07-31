const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.lastName);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
