const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("bcryptjs");
const { response } = require("express");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  if (passwordHash < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const newUser = new User.create({ email, password: passwordHash });

  const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  res.status(201).cookie("token", token, cookieOptions).json({
    newUser,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(500).json({ message: "Password does not match" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };
  res.status(200).cookie("token", token, cookieOptions).json({
    user,
    token,
  });
};

const forgotPassword = async (req, res) => {};

const resetPassword = async (req, res) => {};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
