const Wishlist = require("../../models/v1/wishlist.model");

exports.getAllWishlist = async (req, res, next) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.params.userId })
            .populate('userId')
            .populate('itemId');

        res.send({ success: true, data: wishlistItems });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.getUserWishlist = async (req, res, next) => {
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
}

exports.postWishlist = async (req, res, next) => {
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
}

exports.deleteWishlist = async (req, res, next) => {
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
}