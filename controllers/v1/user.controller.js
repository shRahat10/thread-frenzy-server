const userService = require("../../services/v1/user.service");

exports.getAllUser = async (req, res, next) => {
    try {
        await userService.getAllUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSpecificUsers = async (req, res, next) => {
    try {
        await userService.getSpecificUsers(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.getSingleUser = async (req, res, next) => {
    try {
        await userService.getSingleUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.postUser = async (req, res, next) => {
    try {
        await userService.postUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.patchUser = async (req, res, next) => {
    try {
        await userService.patchUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req, res, next);
    } catch (error) {
        next(error);
    } finally {
        console.log(`Route: ${req.url} || Method: ${req.method}`);
    }
};