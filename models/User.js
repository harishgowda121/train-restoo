const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'user' },   // Role added here
    otp: { type: String },
    otpExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
