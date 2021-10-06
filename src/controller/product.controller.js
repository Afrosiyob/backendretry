const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");
const { Product } = require("../models/models");

const createProduct = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const { userId } = req.user;
        const product = await Product.findOne({ name })
        if (product) {
            logger.error("error", "error please enter other product name")
            next(ApiError.BadRequestError("error", " please enter other name "))
        } else {
            const newProduct = new Product({
                name,
                description,
                owner: userId
            })
            await newProduct.save()
            res.status(201).json({
                message: "new product created",
                data: newProduct,
            })
        }
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}

const getProducts = async (req, res, next) => {
    try {
        res.status(200).json({ data: req.products, message: "all products" });
    } catch (error) {
        logger.error(error)
        next(ApiError.BadRequestError("error", " please enter other name "))
    }
};

const getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params
        const product = await Product.findById(productId)
        if (product) {
            res.status(200).json({
                message: "single product",
                data: product
            })
        } else {
            logger.error("product not founded")
            next(ApiError.BadRequestError("error", "product not founded"))
        }
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { name, description } = req.body
        const { productId } = req.params
        const updatedProduct = await Product.findByIdAndUpdate(productId, { name, description }, { new: true })
        if (updatedProduct) {
            res.status(200).json({
                message: "updated product info",
                data: updateProduct
            })
        } else {
            logger.error("bad request")
            next(ApiError.BadRequestError("error", " bad request "))
        }
    } catch (error) {
        logger.error("error", "product cannot updated")
        next(ApiError.ServerError("server error"))
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params
        const deletedProduct = await Product.findByIdAndRemove(productId)
        if (deletedProduct) {
            res.status(200).json({
                message: "product deleted"
            })
        } else {
            logger.error("product not founded")
            next(ApiError.NotFoundError("product not founded"))
        }
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}