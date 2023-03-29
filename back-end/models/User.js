const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { db } = require("./Quote");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Name is required"],
    maxlength: [50, "Name must have a maximum of 50 characters"],
  },

  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  address1: {
    type: String,
    trim: true,
    default: "",
    maxlength: [100, "Address1 must have a maximum of 100 characters"],
  },

  address2: {
    type: String,
    trim: true,
    default: "",
    maxlength: [100, "Address2 must have a maximum of 100 characters"],
  },

  city: {
    type: String,
    trim: true,
    default: "",
    maxlength: [100, "City must have a maximum of 100 characters"],
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
    minlength: [5, "Zipcode must be at least 5 characters"],
    maxlength: [9, "Zipcode must have a maximum of 9 characters"],
  },

  // isAdmin: {
  //   type: String,
  //   trim: true,
  // },
});

// Hash password:
userSchema.pre("save", function (next) {
  let user = this;

  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) {
      return next(error);
    } else {
      user.password = hash;
      next(); // Next() to save DB step
    }
  });
});

const User = mongoose.model("User", userSchema);

// exports to use it later
module.exports = User;
