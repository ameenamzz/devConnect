const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const toUser = await User.findById(toUserId);
      console.log(toUser);
      await connectionRequest.save();
      res.send("request sent successfully");
      // res.send("connection send successfully");
    } catch (err) {
      res.status(404).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
