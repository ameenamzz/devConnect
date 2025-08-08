var jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodeData = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};
module.exports = { userAuth };
