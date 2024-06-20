// external imports
const mongoose = require("mongoose");

const tshirtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    size: { type: Array, required: true },
    about_product: { type: String, required: true },
    details: { type: Array, required: true },
    color: { type: Array, required: true },
    quantity: { type: Object, require: true },
    images: { type: Object, required: true },
    date: { type: Date, default: Date.now },
})

const Tshirt = mongoose.model('Tshirt', tshirtSchema);

module.exports = Tshirt;