const express = require('express');
const { addHotel, getHotelsByStations } = require('../controllers/hotelController');

const router = express.Router();

router.post('/add-hotel', addHotel);
router.get('/hotels', getHotelsByStations);  // GET with stations query param

module.exports = router;
