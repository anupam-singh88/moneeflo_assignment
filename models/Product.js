const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
