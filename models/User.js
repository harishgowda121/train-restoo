const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
