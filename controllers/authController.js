const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../utils/otpSender');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---- Login / Auto-Signup ----
const loginOrSignup = async (req, res) => {
  const { mobile, role } = req.body;

  try {
    let user = await User.findOne({ mobile });

    // If user doesn't exist, create one
    if (!user) {
      user = new User({
        mobile,
        role: role || 'user', // default role = user
      });
      await user.save();

      console.log('New user created:', user.mobile);
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await user.save();

    // Send OTP via SMS
    await sendOtp(mobile, otp);

    return res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
    });

  } catch (err) {
    console.error('LoginOrSignup Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// ---- Verify OTP ----
const verifyLoginOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ status: 'error', message: 'No OTP requested or OTP expired' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ status: 'error', message: 'OTP expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
    }

    // OTP is valid → clear it
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('VerifyLoginOtp Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// ---- Get All Users ----
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-otp -otpExpiry -__v'); // exclude sensitive fields
    return res.status(200).json({
      status: 'success',
      count: users.length,
      users,
    });
  } catch (err) {
    console.error('GetAllUsers Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// ---- Update User ----
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (mobile) user.mobile = mobile;
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      user: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('UpdateUser Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// ---- Delete User ----
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('DeleteUser Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

module.exports = {
  loginOrSignup,
  verifyLoginOtp,
  getAllUsers,
  updateUser,
  deleteUser
};
