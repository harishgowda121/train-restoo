const express = require('express');
const { requestOtp, login, verifyOtp, verifyLoginOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', requestOtp);           // Request OTP for signup
router.post('/verify-otp', verifyOtp);        // Verify OTP for signup
router.post('/login', login);                 // Login with password → sends OTP
router.post('/verify-login-otp', verifyLoginOtp);  // Verify OTP during login

module.exports = router;
