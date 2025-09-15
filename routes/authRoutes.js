const express = require('express');
const { requestOtp, login, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', requestOtp); // <-- use requestOtp here
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

module.exports = router;
