// external imports
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    price: { type: String, required: true },
    orderedItems: { type: Object, required: true },
    status: { type: String, required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;