const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    price: { type: Number, required: true },
    image_url: { type: String },
    description: { type: String }
});

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_url: { type: String },
    description: { type: String },
    stations: { type: [String], required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    menu: [MenuSchema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', HotelSchema);
