const express = require('express');
const {  loginOrSignup, verifyLoginOtp } = require('../controllers/authController');

const router = express.Router();

// router.post('/signup', requestOtp);           // Request OTP for signup
// router.post('/verify-otp', verifyOtp);        // Verify OTP for signup
router.post('/login', loginOrSignup);                 // Login with password → sends OTP
router.post('/verify-otp', verifyLoginOtp);  // Verify OTP during login

module.exports = router;
