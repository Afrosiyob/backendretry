const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");
const { Product } = require("../models/models");

const createProduct = async (req, res, next) => {
    const { name, description } = req.body;
    const product = await Product.findOne({ name })
    if (product) {
        logger.error("error", "error please enter other product name")
        next(ApiError.BadRequestError("error", " please enter other name "))
    } else {
        const newProduct = new Product({
            name,
            description
        })
        await newProduct.save()
        res.status(201).json({
            message: "new pproduct created",
            data: newProduct
        })
    }
}

module.exports = {
    createProduct
}