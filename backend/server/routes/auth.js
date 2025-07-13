const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
} = require("../controller/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.post("/logout", logoutUser);
router.put("/profile", updateUserProfile);
module.exports = router;
