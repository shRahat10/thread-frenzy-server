const Tshirt = require("../../models/v1/tshirt.model");

exports.getAllTshirt = async (req, res, next) => {
    try {
        const allFilteredItems = await Tshirt.find()
        res.send({ data: allFilteredItems });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.getTshirt = async (req, res, next) => {
    const { brand, gender, sort, page = 1, limit = 6 } = req.query;

    const filters = {};

    if (brand) {
        filters.brand = { $in: brand.split(',') };
    }

    if (gender) {
        filters.gender = gender;
    }

    const sortOrder = sort === 'desc' ? -1 : 1;
    const sortField = sort ? { price: sortOrder } : { date: -1 };

    try {
        const allFilteredItems = await Tshirt.find(filters).sort(sortField);

        const totalItems = allFilteredItems.length;
        const totalPages = Math.ceil(totalItems / limit);

        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const startIndex = (pageInt - 1) * limitInt;
        const paginatedItems = allFilteredItems.slice(startIndex, startIndex + limitInt);

        res.send({
            data: paginatedItems,
            totalItems,
            totalPages,
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.getGenderSpecificTshirt = async (req, res, next) => {
    const gender = req.params.gender;

    const { brand, size, minPrice, maxPrice, page = 1, limit = 6 } = req.query;

    const filters = { gender };
    if (brand) filters.brand = { $in: brand.split(',') };
    if (size) filters.size = { $in: size.split(',') };
    if (minPrice) filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };


    try {
        const totalItems = await Tshirt.countDocuments(filters);
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        const allFilteredItems = await Tshirt.find(filters).skip(skip).limit(parseInt(limit));

        res.send({
            data: allFilteredItems,
            totalItems,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.getSimilartTshirt = async (req, res, next) => {
    const { brand } = req.query;
    try {
        const similarProducts = await Tshirt.find({ brand });
        res.send({ data: similarProducts });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.getSingleTshirt = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tshirt = await Tshirt.findById(id);
        if (!tshirt) {
            return res.status(404).send({ success: false, error: 'T-shirt not found' });
        }
        res.send(tshirt);
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
}

exports.postTshirt = async (req, res, next) => {
    try {
        const newTshirt = new Tshirt(req.body);
        const result = await newTshirt.save();
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.putTshirt = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedProduct = req.body;

        const result = await Tshirt.findByIdAndUpdate(id,
            {
                $set: updatedProduct
            },
            {
                new: true,
                upsert: true
            }
        );

        res.send(result);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}

exports.deleteTshirt = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Tshirt.findByIdAndDelete(id);
        res.send(result);
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
}