const cartService = require("../../services/v1/cart.service");

exports.getAllCart = async (req, res, next) => {
    try {
        await cartService.getAllCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSingleUserCart = async (req, res, next) => {
    try {
        await cartService.getSingleUserCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        await cartService.postCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.putCart = async (req, res, next) => {
    try {
        await cartService.putCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteSingleCart = async (req, res, next) => {
    try {
        await cartService.deleteSingleCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteManyCart = async (req, res, next) => {
    try {
        await cartService.deleteManyCart(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};