const paymentService = require("../../services/v1/payment.service");

exports.getAllPayment = async (req, res, next) => {
    try {
        await paymentService.getAllPayment(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getPayment = async (req, res, next) => {
    try {
        await paymentService.getPayment(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSingleUserPayment = async (req, res, next) => {
    try {
        await paymentService.getSingleUserPayment(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postPayment = async (req, res, next) => {
    try {
        await paymentService.postPayment(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.putPayment = async (req, res, next) => {
    try {
        await paymentService.putPayment(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};