const Hotel = require('../models/Hotel');

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

module.exports = { addHotel };
