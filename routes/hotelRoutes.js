const express = require('express');
const multer = require('multer');
const {
    addHotel,
    verifyHotel,
    addMenuItem,
    toggleKitchen,
    getHotelsByStations
} = require('../controllers/hotelController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Add Hotel (Owner submits details + files)
router.post(
    '/add-hotel',
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'background_image', maxCount: 1 },
        { name: 'gst_license', maxCount: 1 },
        { name: 'fssai_license', maxCount: 1 }
    ]),
    addHotel
);

// ✅ Verify Hotel (Admin)
router.put('/verify/:hotelId', verifyHotel);

// ✅ Add Menu Item (only after verification)
router.post('/:hotelId/menu', addMenuItem);

// ✅ Toggle Kitchen
router.put('/:hotelId/kitchen', toggleKitchen);

// ✅ Get Hotels by Station
router.get('/by-stations', getHotelsByStations);

module.exports = router;
