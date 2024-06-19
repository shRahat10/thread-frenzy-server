// external imports
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    gender: { type: String, required: true },
    size: { type: String, require: true },
    quantity: { type: Number, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;