const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const authenticationMid = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(500).json({ message: "You are not logged in" });
  }

  const decodedData = jwt.verify(token, { secret });

  if (!decodedData) {
    return res.status(500).json({ message: "You are not logged in" });
  }

  req.user = await User.findById(decodedData.id);
  next();
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
