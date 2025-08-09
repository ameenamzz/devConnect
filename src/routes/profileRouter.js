const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateAllowedProfileEdit } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(401).send("ERROR: unauthorized");
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateAllowedProfileEdit) {
      throw new Error("Profile Update not Allowed");
    }
    const user = req.user;
    const bodyField = req.body;
    console.log(user);
    const UpdatedProfile = Object.keys(req.body).forEach(
      (key) => (user[key] = bodyField[key])
    );
    res.json({ data: user });
    await user.save();
    console.log(user);
  } catch (err) {
    res.status(400).send("ERRO: " + err.message);
  }
});

profileRouter.post("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not Strong");
    }
    const newPassword = password;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("password Updated Successfully!");
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
