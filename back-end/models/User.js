const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { db } = require("./Quote");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Name must be required"],
  },

  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Email must be required"],
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Password must be required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  address1: {
    type: String,
    trim: true,
    default: "",
    maxlength: [30, "Maximum length is 30 characters"],
  },

  address2: {
    type: String,
    trim: true,
    default: "",
  },

  city: {
    type: String,
    trim: true,
    default: "",
  },

  state: {
    type: String,
    trim: true,
    default: "",
  },

  zipcode: {
    type: Number,
    trim: true,
    default: "",
  },

  isAdmin: {
    type: String,
    trim: true,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) {
      return next(error);
    } else {
      user.password = hash;
      next();
    }
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;