const axios = require('axios');

const sendOtp = async (mobile, otp) => {
    try {
        const apiKey = '18c5ac9d-91fd-11f0-a562-0200cd936042';  // Replace with your real key
        const templateName = 'SMS_OTP';         // Ensure this is your correct SMS template

        const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/${templateName}`;

        const response = await axios.get(url);

        console.log('OTP Sent:', response.data);

        return response.data;
    } catch (error) {
        console.error('OTP Sending Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send OTP');
    }
};

module.exports = { sendOtp };
