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

      // Inform that account was created
      console.log('New user created:', user.mobile);
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send OTP via SMS
    await sendOtp(mobile, otp);

    return res.status(200).json({
      status: 'success',
      message: user.isNew ? 'Account created. OTP sent.' : 'OTP sent.',
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

module.exports = { loginOrSignup, verifyLoginOtp };
