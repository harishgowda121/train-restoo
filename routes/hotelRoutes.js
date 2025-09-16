const express = require('express');
const { addHotel } = require('../controllers/hotelController');

const router = express.Router();

// POST /api/hotels
router.post('/', addHotel);

module.exports = router;
