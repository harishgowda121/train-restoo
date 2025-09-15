const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
    username: String,
    mobile: { type: String, unique: true },
    password: String,
    email: String,
    otp: String,
    otpExpiry: Date,
});

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
