const Message = require("../../models/v1/message.model");

exports.getMessage = async (req, res, next) => {
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
}

exports.postMessage = async (req, res, next) => {
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
}