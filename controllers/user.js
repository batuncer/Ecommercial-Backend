const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Checking if the email already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    if (passwordHash.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Create a new user object with hashed password and uploaded avatar
    const userDto = {
      username,
      email,
      password: passwordHash,
    };

    const newUser = await User.create(userDto);

    // Generate JWT token for authentication
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    // Set cookie with the JWT token
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Cookie expires in 5 days
    };

    // Sending response with newly registered user and token
    res.status(201).cookie("token", token, cookieOptions).json({
      newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login
const login = async (req, res) => {
  try {
    //Extrat user details from the request body
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if password is correct
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password - Send reset password link via email
const forgotPassword = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Generate reset password token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set resetPasswordToken and resetPasswordExpires in the user document
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 60 * 1000); // Token expires in 5 hours

    // Save user with reset token and expiration time
    await user.save({ validateBeforeSave: false });

    // Construct reset password URL
    const passwordUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset/${resetToken}`;

    // Compose email message
    const message = `You can use this link to reset your password : ${passwordUrl}`;

    // Create SMTP transporter for sending email
    const transporter = nodemailer.createTransport({
      port: 465,
      service: "gmail",
      host: "stamp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSW,
      },
    });

    // Define email options
    const mailData = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Password Reset",
      text: message,
    };

    // Send email with reset password link
    await transporter.sendMail(mailData);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};

const userDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  userDetails,
};
