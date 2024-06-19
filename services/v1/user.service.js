const User = require("../../models/v1/user.model");

exports.getAllUser = async (req, res, next) => {
    try {
        const activeUsers = await User.find({ status: 'active' });
        res.send(activeUsers);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.getSpecificUsers = async (req, res, next) => {
    const { page = 1, limit = 5, status, role } = req.query;
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (status !== "banned" && role) {
        filter.role = role;
    }

    try {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        const totalItems = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limitInt);
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        res.send({
            data: users,
            totalItems: totalItems,
            totalPages: totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
}


exports.getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ userEmail: req.params.userEmail });
        res.send(user);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.postUser = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ userEmail: req.body.userEmail });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                error: 'Email already in use'
            });
        }

        const newUser = new User(req.body);
        const result = await newUser.save();
        res.send(result);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({
                success: false,
                error: 'Duplicate key error: ' + error.message
            });
        } else {
            res.status(500).send({
                success: false,
                error: error.message
            });
        }
    }
}

exports.patchUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedUser = req.body;
        const result = await User.findByIdAndUpdate(id,
            { $set: updatedUser },
            { new: true }
        );

        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await User.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

