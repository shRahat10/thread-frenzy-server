const paymentIntentService = require("../../services/v1/paymentIntent.service");

exports.createPaymentIntent = async (req, res, next) => {
    try {
        await paymentIntentService.createPaymentIntent(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};