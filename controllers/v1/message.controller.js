const messageService = require("../../services/v1/message.service");

exports.getMessage = async (req, res, next) => {
    try {
        await messageService.getMessage(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postMessage = async (req, res, next) => {
    try {
        await messageService.postMessage(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};