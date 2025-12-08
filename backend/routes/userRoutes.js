// const express = require('express');
// const {
//   loginUser,
//   deleteUser,
//   registerUser,
//   resetPassword,
//   forgotPassword,
//   getUserProfile,
//   updateUserProfile,
//   otpLoginRequest,
//   otpVerify
// } = require('../controllers/authController');

// const { protect, verifyRole } = require("../middleware/authMiddleware"); // JWT protect

// const router = express.Router();

// // 🟢 Normal Auth
// router.post('/login', loginUser);
// router.post('/register', registerUser);
// router.get('/user', protect, getUserProfile);
// router.put('/user/:id', protect, updateUserProfile);
// router.delete('/user/:id',  deleteUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

// // 🟢 OTP Login Routes
// router.post('/otp-login', otpLoginRequest);   // Step 1: Send OTP
// router.post('/otp-verify', otpVerify);        // Step 2: Verify OTP and login

// module.exports = router;
const express = require("express");
const {
  registerUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  otpLoginRequest,
  otpVerify,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // JWT protect

const router = express.Router();

// 🔐 Registration (Admin can register users)
router.post("/register", registerUser);

// 🔐 OTP Login Routes
router.post("/otp-login", otpLoginRequest); // Step 1: Send OTP
router.post("/otp-verify", otpVerify); // Step 2: Verify OTP and login

// 👤 User Management
router.get("/user", getUserProfile);
router.put("/user/:id", protect, updateUserProfile);
router.delete("/user/:id", deleteUser);

// ❌ Removed these since password login/reset is no longer needed:
// router.post('/login', loginUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

module.exports = router;
