const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.send(
        fromUserId.firstName,
        "sent connection request to",
        toUserId.firstName
      );
      // res.send("connection send successfully");
    } catch (err) {
      res.status(404).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
