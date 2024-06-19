const Review = require("../../models/v1/review.model");

exports.getAllReview = async (req, res, next) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.send(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.getSingleProductReview = async (req, res, next) => {
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
}

exports.postReview = async (req, res, next) => {
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
}

exports.putReview = async (req, res, next) => {
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
}

exports.deleteReview = async (req, res, next) => {
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
}
