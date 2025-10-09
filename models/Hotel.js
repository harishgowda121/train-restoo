const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true },          
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: String },
    available: { type: Boolean, default: true },     
    image_url: { type: String }                     
});

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    stations: { type: [String], required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Documents & Images
    logo: { type: String },
    background_image: { type: String },
    gst_license: { type: String },
    fssai_license: { type: String },

    // Verification
    verified: { type: Boolean, default: false },

    // Kitchen
    isOpen: { type: Boolean, default: false },

    // Menu
    menu: [MenuSchema],

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', HotelSchema);
