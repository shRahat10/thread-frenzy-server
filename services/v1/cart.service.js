const Cart = require("../../models/v1/cart.model");

exports.getAllCart = async (req, res, next) => {
    try {
        const cartItems = await Cart.find();
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.getSingleUserCart = async (req, res, next) => {
    try {
        const cartItems = await Cart.find({ userEmail: req.params.userEmail });
        res.send(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.postCart = async (req, res, next) => {
    try {
        const newCartItem = new Cart(req.body);
        const result = await newCartItem.save();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.putCart = async (req, res, next) => {
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
}

exports.deleteSingleCart = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Cart.findByIdAndDelete(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.deleteManyCart = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        const result = await Cart.deleteMany({ _id: { $in: ids } });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}