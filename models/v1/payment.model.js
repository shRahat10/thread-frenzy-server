// external imports
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    email: { type: String, },
    price: { type: String, },
    orderedItems: { type: Object, },
    status: { type: String, },
    transactionId: { type: String, },
    date: { type: Date, default: Date.now },
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;