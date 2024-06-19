const BanUser = require("../../models/v1/banUser.model");

exports.getBanUser = async (req, res, next) => {
    try {
        const banUser = await BanUser.find();
        res.send(banUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.postBanUser = async (req, res, next) => {
    try {
        const existingBanUser = await BanUser.findOne({ userEmail: req.body.userEmail });
        if (existingBanUser) {
            return res.status(400).send({
                success: false,
                error: 'User already banned'
            });
        }

        const newBanUser = new BanUser(req.body);
        const result = await newBanUser.save();
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.deleteBanUser = async (req, res, next) => {
    try {
        const userEmail = req.params.userEmail;
        const result = await BanUser.findOneAndDelete({ userEmail: userEmail });
        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
        });
    }
}