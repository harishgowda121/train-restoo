const express = require('express');
const {
  loginOrSignup,
  verifyLoginOtp,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Request OTP for login/signup
 * @access  Public
 */
router.post('/login', loginOrSignup);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login user
 * @access  Public
 */
router.post('/verify-otp', verifyLoginOtp);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (admin view)
 * @access  Admin
 */
router.get('/users', getAllUsers);

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Update user details (role/mobile)
 * @access  Admin
 */
router.put('/users/:id', updateUser);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete user by ID
 * @access  Admin
 */
router.delete('/users/:id', deleteUser);

module.exports = router;
