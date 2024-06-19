const wishlistService = require("../../services/v1/wishlist.service");

exports.getAllWishlist = async (req, res, next) => {
    try {
        await userService.getAllWishlist(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getUserWishlist = async (req, res, next) => {
    try {
        await userService.getUserWishlist(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postWishlist = async (req, res, next) => {
    try {
        await userService.postWishlist(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteWishlist = async (req, res, next) => {
    try {
        await userService.deleteWishlist(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};