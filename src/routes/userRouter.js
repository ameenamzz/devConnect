const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequest) {
      throw new Error("Connection Not Found");
    }

    res.json({
      message: "Data Fetching Succesfull",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(404).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
