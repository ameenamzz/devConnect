const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { Error } = require("mongoose");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());

// ADDING USERS TO DATABASE
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

// GETTING USERS FROM DATABASE
// a) gettting one user
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// b) getting all users
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers) {
      res.status(404).send("No user found");
    } else {
      res.send(allUsers);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// DELETE USER

app.delete("/user", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByIdAndDelete(id);
    console.log(user);
    res.send("User Deleted Sucessfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// UPDATING USER DETAILS

app.patch("/user/:id", async (req, res) => {
  const { ...user } = req.body;
  const id = req.params?.id; // getting the user id from url
  try {
    // ALLOWING ONLY ALLOWED FIELDS TO GET UPDATED
    const ALLOWED_UPDATES = ["id", "lastName", "age", "skills", "description"];
    const isAllowedUpdates = Object.keys(user).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    }

    // NOT ALLOWING MORE THAN 10 SKILLS
    // if (user.skills.length > 10) {
    //   throw new Error("skills more than 10 not allowed");
    // }
    const updateUser = await User.findByIdAndUpdate(id, user, {
      runValidators: true,
    });
    res.send("User updated Succesfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

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
