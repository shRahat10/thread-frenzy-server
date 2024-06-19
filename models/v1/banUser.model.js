// external imports
const mongoose = require("mongoose");

const banUserSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const BanUser = mongoose.model('BanUser', banUserSchema);

module.exports = BanUser;