const banUserService = require("../../services/v1/banUser.service");

exports.getBanUser = async (req, res, next) => {
    try {
        await banUserService.getBanUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postBanUser = async (req, res, next) => {
    try {
        await banUserService.postBanUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteBanUser = async (req, res, next) => {
    try {
        await banUserService.deleteBanUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};