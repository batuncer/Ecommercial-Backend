const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authenticationMid = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const decodedData = jwt.verify(token, secret);
    console.log(`decodedData`, decodedData);
    req.user = await User.findById(decodedData._id);
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};

const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return res
        .status(404)
        .json({ message: "You are not able to access this" });
    }

    next();
  };
};

module.exports = {
  authenticationMid,
  roleCheck,
};
