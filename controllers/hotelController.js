const Hotel = require('../models/Hotel');

// ✅ Add Hotel (Owner submits hotel, stays unverified until admin approves)
const addHotel = async (req, res) => {
    try {
        const { name, description, stations, owner_id } = req.body;

        if (!name || !stations || !owner_id) {
            return res.status(400).json({ status: 'error', message: 'Required fields missing' });
        }

        const newHotel = new Hotel({
            name,
            description,
            stations: Array.isArray(stations) ? stations : stations.split(',').map(s => s.trim()),
            owner_id,
            logo: req.files?.logo ? req.files.logo[0].path : null,
            background_image: req.files?.background_image ? req.files.background_image[0].path : null,
            gst_license: req.files?.gst_license ? req.files.gst_license[0].path : null,
            fssai_license: req.files?.fssai_license ? req.files.fssai_license[0].path : null
        });

        await newHotel.save();

        res.status(201).json({
            status: 'success',
            message: 'Hotel submitted successfully. Waiting for verification.',
            hotel: newHotel
        });
    } catch (err) {
        console.error('Add Hotel Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// ✅ Verify Hotel (Admin only)
const verifyHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { verified: true },
            { new: true }
        );

        if (!hotel) return res.status(404).json({ status: 'error', message: 'Hotel not found' });

        res.status(200).json({
            status: 'success',
            message: 'Hotel verified successfully',
            hotel
        });
    } catch (err) {
        console.error('Verify Hotel Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// ✅ Add Menu Item (Only if verified)
const addMenuItem = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { item_name, price, description, image_url } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ status: 'error', message: 'Hotel not found' });

        if (!hotel.verified) {
            return res.status(403).json({ status: 'error', message: 'Hotel not verified yet' });
        }

        hotel.menu.push({ item_name, price, description, image_url });
        await hotel.save();

        res.status(201).json({
            status: 'success',
            message: 'Menu item added successfully',
            menu: hotel.menu
        });
    } catch (err) {
        console.error('Add Menu Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// ✅ Toggle Kitchen Open/Close
const toggleKitchen = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { isOpen } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ status: 'error', message: 'Hotel not found' });

        if (!hotel.verified) {
            return res.status(403).json({ status: 'error', message: 'Hotel not verified yet' });
        }

        hotel.isOpen = isOpen;
        await hotel.save();

        res.status(200).json({
            status: 'success',
            message: `Kitchen is now ${isOpen ? 'Open' : 'Closed'}`,
            hotel
        });
    } catch (err) {
        console.error('Toggle Kitchen Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// ✅ Get Hotels by Stations
const getHotelsByStations = async (req, res) => {
    try {
        const { stations } = req.query;

        if (!stations) {
            return res.status(400).json({ status: 'error', message: 'Stations query param is required' });
        }

        const stationsArray = stations.split(',').map(st => st.trim());

         const hotels = await Hotel.find({
            stations: { $elemMatch: { $regex: stationsArray.join("|"), $options: "i" } },
            verified: true
        });
        res.status(200).json({
            status: 'success',
            count: hotels.length,
            hotels
        });
    } catch (err) {
        console.error('Get Hotels Error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = {
    addHotel,
    verifyHotel,
    addMenuItem,
    toggleKitchen,
    getHotelsByStations
};

