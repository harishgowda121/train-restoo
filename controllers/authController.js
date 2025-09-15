const User = require('../models/User');
const OtpVerification = require('../models/OtpVerification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../utils/otpSender');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit OTP
};

const requestOtp = async (req, res) => {
    const { username, mobile, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);  // 10 mins expiry
        const hashedPassword = await bcrypt.hash(password, 10);

        let tempUser = await OtpVerification.findOne({ mobile });
        if (tempUser) {
            tempUser.username = username;
            tempUser.password = hashedPassword;
            tempUser.email = email || null;
            tempUser.otp = otp;
            tempUser.otpExpiry = otpExpiry;
        } else {
            tempUser = new OtpVerification({
                username,
                mobile,
                password: hashedPassword,
                email: email || null,
                otp,
                otpExpiry
            });
        }

        await tempUser.save();
        await sendOtp(mobile, otp);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to your mobile number'
        });
    } catch (err) {
        console.error('Request OTP Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const tempUser = await OtpVerification.findOne({ mobile });

        if (!tempUser || tempUser.otp !== otp || tempUser.otpExpiry < new Date()) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
        }

        // Create real user now
        const user = new User({
            username: tempUser.username,
            mobile: tempUser.mobile,
            password: tempUser.password,
            email: tempUser.email
        });

        await user.save();
        await OtpVerification.deleteOne({ mobile });  // Clean up temp data

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 'success',
            message: 'OTP verified and account created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                mobile: user.mobile,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Verify OTP Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { mobile, password, otp } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ status: 'error', message: 'Invalid mobile' });

        if (otp) {
            if (user.otp !== otp || user.otpExpiry < new Date()) {
                return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
            }

            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                status: 'success',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    mobile: user.mobile,
                    email: user.email
                }
            });
        } else if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ status: 'error', message: 'Invalid password' });

            const newOtp = generateOTP();
            user.otp = newOtp;
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            await sendOtp(mobile, newOtp);

            return res.status(200).json({
                status: 'success',
                message: 'OTP sent for verification'
            });
        } else {
            return res.status(400).json({ status: 'error', message: 'Provide either OTP or Password' });
        }
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = { requestOtp, verifyOtp, login };
