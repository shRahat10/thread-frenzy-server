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

const verifyToken = (role) => (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log("verify token: ", token);

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized access' });
        }
        req.user = decoded;
        if (role && role !== decoded.role) {
            return res.status(403).send({ message: 'Unauthorized access' });
        }
        next();
    });
};

app.get('/', (req, res, next) => {
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

// // Cooky Options
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
    discount: { type: Number, required: true },
    size: { type: Array, required: true },
    about_product: { type: String, required: true },
    details: { type: Array, required: true },
    color: { type: Array, required: true },
    quantity: { type: Object, require: true },
    images: { type: Object, required: true },
    date: { type: Date, default: Date.now },
})

const cartSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    gender: { type: String, required: true },
    size: { type: String, require: true },
    quantity: { type: Number, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

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

const paymentSchema = new mongoose.Schema({
    email: { type: String, },
    price: { type: String, },
    orderedItems: { type: Object, },
    status: { type: String, },
    transactionId: { type: String, },
    date: { type: Date, default: Date.now },
})

const productReviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number },
    date: { type: Date, default: Date.now },
})

const messageSchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

//Define Models
const Tshirt = mongoose.model('Tshirt', tshirtSchema);
const Cart = mongoose.model('Cart', cartSchema);
const User = mongoose.model('User', userSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Review = mongoose.model('Review', productReviewSchema);
const Message = mongoose.model('Message', messageSchema);

// Populate Schemas
const wishlistSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Tshirt" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// JWT Routes
app.post("/jwt", async (req, res, next) => {
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
});

app.post("/logout", (req, res, next) => {
    res.clearCookie('jwt', cookieOptions);
    res.send({ success: true });
});

// Data CRUD Operations

app.get('/t-shirt-all', async (req, res, next) => {
    try {
        const allFilteredItems = await Tshirt.find()
        res.send({ data: allFilteredItems });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/t-shirt', async (req, res, next) => {
    const { brand, gender, sort, page = 1, limit = 6 } = req.query;

    const filters = {};

    if (brand) {
        filters.brand = { $in: brand.split(',') };
    }

    if (gender) {
        filters.gender = gender;
    }

    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortField = sort ? { price: sortOrder } : { date: -1 };

    try {
        const allFilteredItems = await Tshirt.find(filters).sort(sortField);

        const totalItems = allFilteredItems.length;
        const totalPages = Math.ceil(totalItems / limit);

        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const startIndex = (pageInt - 1) * limitInt;
        const paginatedItems = allFilteredItems.slice(startIndex, startIndex + limitInt);

        res.send({
            data: paginatedItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/t-shirt/similar-product', async (req, res, next) => {
    const { brand } = req.query;
    const filters = { brand };
    try {
        const similarProducts = await Tshirt.find(filters);
        res.send({ data: similarProducts });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/t-shirt/:gender', async (req, res, next) => {
    const gender = req.params.gender;

    const { brand, size, minPrice, maxPrice, page = 1, limit = 6 } = req.query;

    const filters = { gender };
    if (brand) filters.brand = { $in: brand.split(',') };
    if (size) filters.size = { $in: size.split(',') };
    if (minPrice) filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };


    try {
        const totalItems = await Tshirt.countDocuments(filters);
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        const allFilteredItems = await Tshirt.find(filters).skip(skip).limit(parseInt(limit));

        req.tshirtData = {
            data: allFilteredItems,
            totalItems,
            totalPages,
            currentPage: parseInt(page),
        };

        next();
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.get('/t-shirt/:id', verifyToken(), async (req, res, next) => {
    const id = req.params.id;

    try {
        const tshirt = await Tshirt.findById(id);
        if (!tshirt) {
            return res.status(404).send({ success: false, error: 'T-shirt not found' });
        }
        res.send(tshirt);
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/t-shirt', verifyToken('admin'), async (req, res, next) => {
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

app.put('/t-shirt/:id', verifyToken(), async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedProduct = req.body;

        const result = await Tshirt.findByIdAndUpdate(id,
            {
                $set: updatedProduct
            },
            {
                new: true,
                upsert: true
            }
        );

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

app.delete('/t-shirt/:id', verifyToken('admin'), async (req, res, next) => {
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
app.get('/cart', verifyToken(), async (req, res, next) => {
    try {
        const cartItems = await Cart.find();
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/cart/:userEmail', verifyToken(), async (req, res, next) => {
    try {
        const cartItems = await Cart.find({ userEmail: req.params.userEmail });
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/cart', verifyToken(), async (req, res, next) => {
    try {
        const newCartItem = new Cart(req.body);
        const result = await newCartItem.save();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.put('/cart/:id', verifyToken(), async (req, res, next) => {
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

app.delete('/cart/:id', verifyToken(), async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Cart.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.delete('/cart', verifyToken(), async (req, res, next) => {
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
app.get('/user-all', verifyToken('admin'), async (req, res, next) => {
    try {
        const activeUsers = await User.find({ status: 'active' });
        res.send(activeUsers);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

// utils
const getUsers = async (filter, page, limit, sort = { date: -1 }) => {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    const totalItems = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitInt);
    const users = await User.find(filter)
        .sort(sort)
        .skip((pageInt - 1) * limitInt)
        .limit(limitInt);

    return { users, totalItems, totalPages, currentPage: pageInt };
};

app.get('/user-specific', verifyToken('admin'), async (req, res, next) => {
    const { page = 1, limit = 5, status, role } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (status !== "banned" && role) {
        filter.role = role;
    }

    try {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const totalItems = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limitInt);
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: users,
            totalItems: totalItems,
            totalPages: totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
});

app.get('/user/:userEmail', verifyToken(), async (req, res, next) => {
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

app.post('/user', async (req, res, next) => {
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

app.patch('/user/:id', verifyToken(), async (req, res, next) => {
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

app.delete('/user/:id', verifyToken('admin'), async (req, res, next) => {
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

app.get('/wishlist-all/:userId', verifyToken(), async (req, res, next) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.params.userId })
            .populate('userId')
            .populate('itemId');

        res.send({ success: true, data: wishlistItems });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/wishlist/:userId', verifyToken(), async (req, res, next) => {
    const { page = 1, limit = 6 } = req.query;

    try {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        const totalItems = await Wishlist.countDocuments({ userId: req.params.userId });
        const totalPages = Math.ceil(totalItems / limitInt);
        const wishlistItems = await Wishlist.find({ userId: req.params.userId })
            .populate('userId')
            .populate('itemId')
            .sort({ date: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: wishlistItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/wishlist', verifyToken(), async (req, res, next) => {
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

app.delete('/wishlist/:id', verifyToken(), async (req, res, next) => {
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
app.post('/create-payment-intent', async (req, res, next) => {
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
app.get('/payment-all', verifyToken('admin'), async (req, res, next) => {
    try {
        const paymentItems = await Payment.find();
        res.send(paymentItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/payment', verifyToken('admin'), async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        const totalItems = await Payment.countDocuments();
        const totalPages = Math.ceil(totalItems / limitInt);
        const paymentItems = await Payment.find()
            .sort({ date: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: paymentItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/payment/:email', verifyToken(), async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        const totalItems = await Payment.countDocuments({ email: req.params.email });
        const totalPages = Math.ceil(totalItems / limitInt);
        const paymentItems = await Payment.find({ email: req.params.email })
            .sort({ date: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: paymentItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/payment', verifyToken(), async (req, res, next) => {
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

app.put('/payment/:id', verifyToken('admin'), async (req, res, next) => {
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
app.get('/review-all/:productId', verifyToken(), async (req, res, next) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.send(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.get('/review/:productId', verifyToken(), async (req, res, next) => {
    const { page = 1, limit = 3 } = req.query;

    try {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        const totalItems = await Review.countDocuments({ productId: req.params.productId });
        const totalPages = Math.ceil(totalItems / limitInt);
        const reviewItems = await Review.find({ productId: req.params.productId })
            .sort({ date: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: reviewItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/review', verifyToken(), async (req, res, next) => {
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

app.put('/review/:id', verifyToken(), async (req, res, next) => {
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

app.delete('/review/:id', verifyToken(), async (req, res, next) => {
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

// contact us CRUD operations
app.get('/contact-us', verifyToken('admin'), async (req, res, next) => {
    const { page = 1, limit = 6 } = req.query;

    try {
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        const totalItems = await Message.countDocuments();
        const totalPages = Math.ceil(totalItems / limitInt);
        const messageItems = await Message.find()
            .sort({ date: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: messageItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
});

app.post('/contact-us', async (req, res, next) => {
    try {
        const newMessage = new Message(req.body);
        const result = await newMessage.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

