const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 10,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    description: {
      type: [String],
    },
  },
  {
    autoIndex: true,
  },
  {
    timestamps: true,
  }
);
// userSchema.index({ email: 1 }, { unique: true });

// userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
