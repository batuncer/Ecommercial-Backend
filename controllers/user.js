const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("bcryptjs");
const { error } = require("console");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  const avatar = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 130,
    crop: "scale",
  });
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

  const newUser = new User.create({
    name,
    email,
    password: passwordHash,
    avatar: {
      public_id: avatar.public_id,
      url: avatar.secure_url,
    },
  });

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

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const passwordUrl = `${req.protocol}://${req.get(
    "host"
  )}/reset/${resetToken}`;

  const message = `You can use this link to reset your password : ${passwordUrl}`;

  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      service: "gmail",
      host: "stamp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSW,
      },
    });

    const mailData = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Password Reset",
      text: message,
    };

    await transporter.sendMail(mailData);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Password reset token is invalid" });
  }
  user.password = req.body.password;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expires: "1h",
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

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

const userDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    user,
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  userDetails,
};
