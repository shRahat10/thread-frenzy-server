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
    name: { type: String, required: true },
    brand: { type: String, required: true },
    gender: { type: String, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: Array, required: true },
    about_product: { type: String, required: true },
    details: { type: Array, required: true },
    color: { type: Array, required: true },
    images: { type: Object, required: true }
})

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
})

//Define Models
const Tshirt = mongoose.model('Tshirt', tshirtSchema);
const Cart = mongoose.model('Cart', cartSchema);

//TODO: JWT Routes

// Data CRUD Operations
app.get('/t-shirt', async (req, res) => {
    try {
        const tshirt = await Tshirt.find();
        res.send(tshirt);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/t-shirt/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tshirt = await Tshirt.findById(id);
        if (!tshirt) {
            return res.status(404).send({ success: false, error: 'T-shirt not found' });
        }
        res.send(tshirt);
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/t-shirt', async (req, res) => {
    try {
        const newTshirt = new Tshirt(req.body);
        const result = await newTshirt.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.put('/t-shirt/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTshirt = req.body;
        const result = await Tshirt.findByIdAndUpdate(id,
            {
                $set: updatedTshirt
            },
            {
                new: true,
                upsert: true
            }
        );

        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.delete('/t-shirt/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Tshirt.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

// Cart CRUD Operations
app.get('/cart/:userId', async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId })
        res.send(cartItems);
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/cart', async (req, res) => {
    try {
        const newCartItem = new Cart(req.body);
        const result = await newCartItem.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedCartItem = req.body;
        const result = await Cart.findByIdAndDelete(
            id, 
            { $set: updatedCartItem },
            { new: true, upsert: true }
        );
        res.send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Cart.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});
