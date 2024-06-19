// external imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// internal imports 
const error = require("./middleware/error.middleware");
const userRoute = require("./routes/v1/user.route");
const tshirtRoute = require("./routes/v1/tshirt.route");
const cartRoute = require("./routes/v1/cart.route");
const paymentRoute = require("./routes/v1/payment.route");
const paymentIntentRoute = require("./routes/v1/paymentIntent.route");
const reviewRoute = require("./routes/v1/review.route");
const wishlistRoute = require("./routes/v1/wishlist.route");
const messageRoute = require("./routes/v1/message.route");
const jwtRoute = require("./routes/v1/jwt.route");
const banUserRoute = require("./routes/v1/banUser.route");

// application level connection 
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://study-buddies-7ea63.web.app',
        'https://study-buddies-7ea63.firebaseapp.com'
    ],
    credentials: true
}));
// http://localhost:5000/v1/api/user/user-all
app.use("/v1/api", userRoute);
app.use("/v1/api", tshirtRoute);
app.use("/v1/api", cartRoute);
app.use("/v1/api", paymentRoute);
app.use("/v1/api", paymentIntentRoute);
app.use("/v1/api", reviewRoute);
app.use("/v1/api", wishlistRoute);
app.use("/v1/api", messageRoute);
app.use("/v1/api", jwtRoute);
app.use("/v1/api", banUserRoute);

// global error handler 
app.use(error);

// connection establishment 
app.get("/", (req, res, next) => {
    try {
        res.status(200).json({
            acknowledgement: true,
            message: "OK",
            description: "The request is OK",
        });
    } catch (err) {
        next(err);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
});

// export application 
module.exports = app;
