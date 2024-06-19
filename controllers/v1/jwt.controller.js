const jwtService = require("../../services/v1/jwt.service");

exports.createToken = async (req, res, next) => {
    try {
        await jwtService.createToken(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.jwtLogout = async (req, res, next) => {
    try {
        await jwtService.jwtLogout(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};