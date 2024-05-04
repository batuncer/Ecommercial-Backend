const express = require("express");
const {
  login,
  logout,
  register,
  resetPassword,
  forgotPassword,
  userDetails,
} = require("../controllers/user.js");
const { authenticationMid } = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/me", authenticationMid, userDetails);

module.exports = router;
