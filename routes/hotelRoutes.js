const express = require('express');
const router = express.Router();
const {
    addHotel,
    verifyHotel,
    addMenuItem,
    toggleKitchen,
    getHotelsByStations
} = require('../controllers/hotelController');
const { upload } = require('../config/cloudinary');

// ✅ Owner submits hotel with docs/images
router.post(
    '/add',
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'background_image', maxCount: 1 },
        { name: 'gst_license', maxCount: 1 },
        { name: 'fssai_license', maxCount: 1 }
    ]),
    addHotel
);

// ✅ Admin verifies hotel
router.put('/verify/:hotelId', verifyHotel);

// ✅ Add menu item (only if verified)
router.post('/:hotelId/menu', addMenuItem);

// ✅ Toggle kitchen (open/close)
router.patch('/:hotelId/kitchen', toggleKitchen);

// ✅ Get hotels by stations (user search)
router.get('/stations', getHotelsByStations);

module.exports = router;
