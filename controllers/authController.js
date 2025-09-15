const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../utils/otpSender');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
};

const signup = async (req, res) => {
    const { username, mobile, password, email } = req.body;

    try {
        let user = await User.findOne({ mobile });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            username,
            mobile,
            password: hashedPassword,
            email: email || null,
            otp,
            otpExpiry
        });

        await user.save();

        await sendOtp(mobile, otp);  // Send OTP to mobile

        res.status(200).json({ message: 'OTP sent to your mobile number' });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const user = await User.findOne({ mobile });

        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error('Verify OTP Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { mobile, password, otp } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ message: 'Invalid mobile' });

        if (otp) {
            if (user.otp !== otp || user.otpExpiry < new Date()) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            user.otp = null;
            user.otpExpiry = null;
            await user.save();
        } else if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

            // Generate OTP on successful password match for second-factor login
            const newOtp = generateOTP();
            user.otp = newOtp;
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            await sendOtp(mobile, newOtp);  // Send OTP for verification

            return res.status(200).json({ message: 'OTP sent for verification' });
        } else {
            return res.status(400).json({ message: 'Provide either OTP or Password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                username: user.username,
                mobile: user.mobile,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login, verifyOtp };
