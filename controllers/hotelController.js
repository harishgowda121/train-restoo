const Hotel = require('../models/Hotel');

// Add Hotel (Already Provided)
const addHotel = async (req, res) => {
    try {
        const { name, image_url, description, stations, owner_id, menu } = req.body;

        if (!name || !stations || !owner_id || !menu) {
            return res.status(400).json({ status: 'error', message: 'Required fields missing' });
        }

        const newHotel = new Hotel({
            name,
            image_url,
            description,
            stations,
            owner_id,
            menu
        });

        await newHotel.save();

        return res.status(201).json({
            status: 'success',
            message: 'Hotel added successfully',
            hotel: newHotel
        });

    } catch (err) {
        console.error('Add Hotel Error:', err.message);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// ✅ Get Hotels by Station(s)
const getHotelsByStations = async (req, res) => {
    try {
        const { stations } = req.query;

        if (!stations) {
            return res.status(400).json({ status: 'error', message: 'Stations query param is required' });
        }

        // Parse stations query into array (comma-separated)
        const stationsArray = stations.split(',').map(st => st.trim());

        const hotels = await Hotel.find({
            stations: { $in: stationsArray }
        });

        return res.status(200).json({
            status: 'success',
            count: hotels.length,
            hotels
        });

    } catch (err) {
        console.error('Get Hotels Error:', err.message);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

module.exports = { addHotel, getHotelsByStations };
