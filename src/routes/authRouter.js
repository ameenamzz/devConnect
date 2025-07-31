const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { Error } = require("mongoose");
// ADDING USER TO DATABASE
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password, age, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      skills,
    }); //CREATING A NEW INSTANCE OF USER MODEL
    await user.save(); //ADDING THE DATA TO DATABASE
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("email not valid");
    }
    const isPasswordValid = await user.validatePassword(password); // CHECK PASSWORD IS MATCHING OR NOT
    if (isPasswordValid) {
      //--- JWT TOKEN ----
      const token = await user.getJWT(); // 1- CREATE A JWT TOKEN
      res.cookie("token", token); // 2- ADD THE TOKEN TO COOKIE AND SEND IT TO USER
      res.send("Login Succesfull");
    } else {
      throw new Error("Password not valid");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful");
});

module.exports = authRouter;
