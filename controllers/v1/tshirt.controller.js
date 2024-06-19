const tshirtService = require("../../services/v1/tshirt.service");

exports.getAllTshirt = async (req, res, next) => {
    try {
        await tshirtService.getAllTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getTshirt = async (req, res, next) => {
    try {
        await tshirtService.getTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getGenderSpecificTshirt = async (req, res, next) => {
    try {
        await tshirtService.getGenderSpecificTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSimilartTshirt = async (req, res, next) => {
    try {
        await tshirtService.getSimilartTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSingleTshirt = async (req, res, next) => {
    try {
        await tshirtService.getSingleTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postTshirt = async (req, res, next) => {
    try {
        await tshirtService.postTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.putTshirt = async (req, res, next) => {
    try {
        await tshirtService.putTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteTshirt = async (req, res, next) => {
    try {
        await tshirtService.deleteTshirt(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};