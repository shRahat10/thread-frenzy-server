// external imports
const jwt = require('jsonwebtoken');

// internal imports
const User = require('../../models/v1/user.model');

// Cooky Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

exports.createToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ userEmail: email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const token = jwt.sign({ email: user.userEmail, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('jwt', token, cookieOptions);
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

exports.jwtLogout = (req, res, next) => {
    res.clearCookie('jwt', cookieOptions);
    res.send({ success: true });
}