// external imports
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Tshirt" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;