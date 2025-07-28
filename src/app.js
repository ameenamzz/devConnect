const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

// ADDING USERS TO DATABASE
app.post("/signup", async (req, res) => {
  const user = new User(req.body); //CREATING A NEW INSTANCE OF USER MODEL
  try {
    await user.save(); //ADDING THE DATA TO DATABASE
    res.send("User Added Successfully");
    console.log(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
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

app.delete("/userDelete", async (req, res) => {
  const deleteUser = req.body.firstName;
  try {
    const user = await User.deleteOne({ firstName: deleteUser });
    res.send("User Deleted Sucessfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// UPDATING USER DETAILS

app.patch("/userUpdate", async (req, res) => {
  const { id, ...user } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, user);
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
