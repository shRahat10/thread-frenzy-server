const reviewService = require("../../services/v1/review.service");

exports.getAllReview = async (req, res, next) => {
    try {
        await reviewService.getAllReview(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSingleProductReview = async (req, res, next) => {
    try {
        await reviewService.getSingleProductReview(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postReview = async (req, res, next) => {
    try {
        await reviewService.postReview(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.putReview = async (req, res, next) => {
    try {
        await reviewService.putReview(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        await reviewService.deleteReview(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};