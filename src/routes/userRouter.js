const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { set } = require("mongoose");

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

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    console.log(connectionRequest);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    res.status(404).send("ERROR :" + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const connectionRequest = await ConnectionRequest.find({
    $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
  }).select("fromUserId toUserId");

  const hideUserFromFeed = new Set();
  connectionRequest.forEach((req) => {
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
  });

  const users = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUserFromFeed) } },
      { _id: { $ne: loggedInUser._id } },
    ],
  })
    .select("firstName lastName age skills photURL")
    .skip(skip)
    .limit(limit);

  res.send(users);
});

module.exports = userRouter;
