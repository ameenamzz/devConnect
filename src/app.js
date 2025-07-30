const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { Error } = require("mongoose");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
// var jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// ADDING USERS TO DATABASE
// Sign Up
app.post("/signup", async (req, res) => {
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
    console.log(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Sign In
app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.lastName);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

// GETTING USERS FROM DATABASE
// a) gettting one user
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.email;
//   try {
//     const user = await User.find({ email: userEmail });
//     if (user.length === 0) {
//       res.status(404).send("No user found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// b) getting all users
// app.get("/feed", async (req, res) => {
//   try {
//     const allUsers = await User.find({});
//     if (!allUsers) {
//       res.status(404).send("No user found");
//     } else {
//       res.send(allUsers);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// DELETE USER
// app.delete("/user", async (req, res) => {
//   const { id } = req.body;
//   try {
//     const user = await User.findByIdAndDelete(id);
//     console.log(user);
//     res.send("User Deleted Sucessfully!");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// UPDATING USER DETAILS
// app.patch("/user/:id", async (req, res) => {
//   const { ...user } = req.body;
//   const id = req.params?.id; // getting the user id from url
//   try {
//     // ALLOWING ONLY ALLOWED FIELDS TO GET UPDATED
//     const ALLOWED_UPDATES = ["id", "lastName", "age", "skills", "description"];
//     const isAllowedUpdates = Object.keys(user).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isAllowedUpdates) {
//       throw new Error("Update not allowed");
//     }

//     // NOT ALLOWING MORE THAN 10 SKILLS
//     // if (user.skills.length > 10) {
//     //   throw new Error("skills more than 10 not allowed");
//     // }
//     const updateUser = await User.findByIdAndUpdate(id, user, {
//       runValidators: true,
//     });
//     res.send("User updated Succesfully");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// DB AND SERVER CONNECTION
connectDB()
  .then(() => {
    console.log("Cluster Connection Established Succesfully...");
    app.listen(7777, () => {
      console.log("app is listening to port 7777...");
    });
  })
  .catch((err) => {
    console.log("something went wrong!!");
  });
