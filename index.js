require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Double } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, require: true },
    quantity: { type: Number, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    transactionId: { type: String, required: true },
})

const userSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String, },
    userEmail: { type: String, unique: true },
    phoneNumber: { type: Number, },
    photoUrl: { type: String },
    role: { type: String, required: true },
})

const paymentSchema = new mongoose.Schema({
    email: { type: String, },
    price: { type: String, },
    date: { type: Date, },
    orderedItems: { type: Object, },
    status: { type: String, },
    transactionId: { type: String, },
})

const productReviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number },
    date: { type: Date, default: Date.now }
})

//Define Models
const Tshirt = mongoose.model('Tshirt', tshirtSchema);
const Cart = mongoose.model('Cart', cartSchema);
const User = mongoose.model('User', userSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Review = mongoose.model('Review', productReviewSchema);

// Populate Schemas
const wishlistSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Tshirt" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

//TODO: JWT Routes

// Data CRUD Operations
app.get('/t-shirt', async (req, res) => {
    const { brand, price, size, rating, gender, sort } = req.query;

    const filters = {};

    if (brand) {
        filters.brand = { $in: brand.split(',') };
    }

    if (price) {
        const [minPrice, maxPrice] = price.split(',').map(Number);
        filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (size) {
        filters.size = { $in: size.split(',') };
    }

    if (rating) {
        const [minRating, maxRating] = rating.split(',').map(Number);
        filters.rating = { $gte: minRating, $lte: maxRating };
    }

    if (gender) {
        filters.gender = gender;
    }

    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortField = sort ? { price: sortOrder } : {};

    try {
        const tshirts = await Tshirt.find(filters).sort(sortField);
        res.send(tshirts);
    } catch (error) {
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
app.get('/cart', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/cart/:userEmail', async (req, res) => {
    try {
        const cartItems = await Cart.find({ userEmail: req.params.userEmail });
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/cart', async (req, res) => {
    try {
        const newCartItem = new Cart(req.body);
        const result = await newCartItem.save();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedCartItem = req.body;
        const result = await Cart.findByIdAndUpdate(
            id,
            { $set: updatedCartItem },
            { new: true, upsert: true }
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Cart.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.delete('/cart', async (req, res) => {
    try {
        const ids = req.body.ids;
        const result = await Cart.deleteMany({ _id: { $in: ids } });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});


// User CRUD Operations
app.get('/user', async (req, res) => {
    try {
        const user = await User.find();
        res.send(user);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/user/:userEmail', async (req, res) => {
    try {
        const user = await User.findOne({ userEmail: req.params.userEmail });
        res.send(user);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.post('/user', async (req, res) => {
    try {
        const existingUser = await User.findOne({ userEmail: req.body.userEmail });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                error: 'Email already in use'
            });
        }

        const newUser = new User(req.body);
        const result = await newUser.save();
        res.send(result);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({
                success: false,
                error: 'Duplicate key error: ' + error.message
            });
        } else {
            res.status(500).send({
                success: false,
                error: error.message
            });
        }
    }
});

app.patch('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = req.body;
        const result = await User.findByIdAndUpdate(id,
            { $set: updatedUser },
            { new: true }
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

app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

// Wishlist CRUD Operations
app.get('/wishlist/:userId', async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.params.userId })
            .populate('userId')
            .populate('itemId');

        res.send(wishlistItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/wishlist', async (req, res) => {
    try {
        const { itemId, userId } = req.body;
        const tshirtExists = await Tshirt.findById(itemId);

        if (!tshirtExists) {
            return res.status(400).send({
                success: false,
                error: 'Tshirt not found'
            });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).send({
                success: false,
                error: 'User not found'
            });
        }

        const existingWishlistItem = await Wishlist.findOne({ itemId, userId });
        if (existingWishlistItem) {
            return res.status(400).send({
                success: false,
                error: 'Item already exists in the wishlist'
            });
        }

        const newWishlistItem = new Wishlist({ itemId, userId });
        await newWishlistItem.save();

        const populatedWishlistItem = await Wishlist.findById(newWishlistItem._id)
            .populate('itemId')
            .populate('userId');

        res.send(populatedWishlistItem);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.delete('/wishlist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Wishlist.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
});

// payment intent
app.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// payment CRUD operations
app.get('/payment', async (req, res) => {
    try {
        const paymentItems = await Payment.find();
        res.send(paymentItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/payment/:email', async (req, res) => {
    try {
        const paymentItems = await Payment.find({ email: req.params.email });
        res.send(paymentItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/payment', async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        const result = await newPayment.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.put('/payment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedPaymentItem = req.body;
        const result = await Payment.findByIdAndUpdate(
            id,
            { $set: updatedPaymentItem },
            { new: true, upsert: true }
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// product review CRUD operations
app.get('/review/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.send(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/review', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const result = await newReview.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.put('/review/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedReview = req.body;
        const result = await Review.findByIdAndUpdate(
            id,
            { $set: updatedReview },
            { new: true, upsert: true }
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.delete('/review/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Review.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
});
