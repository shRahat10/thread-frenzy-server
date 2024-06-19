const Payment = require("../../models/v1/payment.model");

exports.getAllPayment = async (req, res, next) => {
    try {
        const paymentItems = await Payment.find();
        res.send(paymentItems);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.getPayment = async (req, res, next) => {
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
}

exports.getSingleUserPayment = async (req, res, next) => {
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
}

exports.postPayment = async (req, res, next) => {
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
}

exports.putPayment = async (req, res, next) => {
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
}