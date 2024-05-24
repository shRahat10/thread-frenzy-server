const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Double } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

const logger = (req, res, next) => {
    console.log('log info: ', req.method, req.url);
    next();
};

const verifyToken = (req, res, next) => {

};

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.konbhzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'thread-frenzy',
})
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Could not connect to MongoDB...", err));

// Cooky Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};
//Define Schemas
const tshirtSchema = new mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    gender: {
        type: String
    },
    rating: {
        type: Number
    },
    price: {
        type: Number
    },
    size: {
        type: Array
    },
    about_product: {
        type: String
    },
    details: {
        type: String
    },
    color: {
        type: String
    },
    images: {
        type: Object
    }
})

//Define Models
const Tshirt = mongoose.model('Tshirt', tshirtSchema);

//TODO: JWT Routes


//TODO: CRUD Operations

