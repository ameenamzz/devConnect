const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // 1 - STATUS VALIDATION
      const allowedStatus = ["interested", "ignore"];
      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status");
      }

      // 2 - VALIDATING TO USER EXIST
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User Doesnt exist");
      }

      // 3 - VALIDATING CONNECTION REQUEST TO SAME USER
      if (fromUserId.equals(toUserId)) {
        throw new Error("Cannot Send Request to Yourself");
      }
      // OR
      // if (fromUserId.toString() === toUserId.toString()) {
      //   throw new Error("Cannot Send Request to Yourself");
      // }

      //4 - VALIDATING IS THERE EXISTING CONNECTION ALREADY
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        throw new Error("connection already exist");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      const emailRes = await sendEmail.run(
        "Connection Request Update",
        `Your connection request has been ${status} by ${user.firstName}.`
      );

      res.json({
        message: status + "successfully",
      });
    } catch (err) {
      res.status(404).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser,
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "connection Request" + status,
      });
    } catch (err) {
      res.status(404).send("ERROR :" + err.message);
    }
  }
);

module.exports = requestRouter;
