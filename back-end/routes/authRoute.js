const {
  login,
  register,
  getCurrentUser,
  updateCurrentUser,
  getAllUser,
} = require("../controllers/authController");
const { checkCurrentUser } = require("../middlewares/checkCurrentUser");

const { verifyToken } = require("../middlewares/verifyToken");

const express = require("express");

const Router = express.Router();

Router.route("/register").post(register);

Router.route("/login").post(login);

Router.route("/").get(checkCurrentUser, getCurrentUser);

// get all users
Router.route("/allUsers").get(getAllUser);

// get current user
Router.route("/userProfile").get(checkCurrentUser, getCurrentUser);

Router.route("/quoteHistory").get(checkCurrentUser, getCurrentUser);

// update current user profile
Router.route("/userProfile/:userId").put(verifyToken, updateCurrentUser);

module.exports = Router;
