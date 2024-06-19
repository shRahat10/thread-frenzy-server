// external imports
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number },
    date: { type: Date, default: Date.now },
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;