const mongoose = require("mongoose");
var validator = require("validator");
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
       validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("email not valid");
        }
      },
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
    photURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("skills more than 10 not allowed");
        }
      },
    },
    description: {
      type: [String],
    },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);
// userSchema.index({ email: 1 }, { unique: true });

// userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
