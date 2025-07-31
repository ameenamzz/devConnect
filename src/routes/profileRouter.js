const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateAllowedProfileEdit } = require("../utils/validation");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
    res.send(user.firstName + user.lastName + " your profile Updated Successfully");
    await user.save();
    console.log(user);
  } catch (err) {
    res.status(400).send("ERRO: " + err.message);
  }
});

module.exports = profileRouter;
