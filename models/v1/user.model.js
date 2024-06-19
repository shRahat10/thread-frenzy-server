// external imports
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String, },
    userEmail: { type: String, unique: true },
    phoneNumber: { type: Number, },
    photoUrl: { type: String },
    role: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema);

module.exports = User;