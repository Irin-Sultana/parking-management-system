const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controller/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);

module.exports = router;
