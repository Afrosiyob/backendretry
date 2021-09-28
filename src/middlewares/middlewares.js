
const { validationResult } = require("express-validator");
const { ApiError } = require("../errors/ApiError");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, Product } = require("../models/models");
const { logger } = require("../logger/logger");


const validationError = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array(), "error")
        await next(ApiError.BadRequestError(errors.array(), "badrequest error"));
    } else {
        await next();
    }
};

const checkAuthToken = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        await next();
    } else {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
        }
        if (!token) {
            await next(ApiError.UnauthorizedError("faild token", "auth error"));
        } else {
            try {
                let decoded = jwt.verify(token, config.get("jwtSecret"));
                req.user = decoded;
                res.setHeader("Last-Modified", new Date().toUTCString());
                await next();
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    logger.error(error, "token  exparied")
                    await next(ApiError.BadRequestError(error, "token  exparied"));
                } else if (error instanceof jwt.JsonWebTokenError) {
                    logger.error(error, "invalid token")
                    await next(ApiError.BadRequestError(error, "invalid token"));
                }
            }
        }
    }
};

// Check permissions
const setPermissions = (permissions) => async (req, res, next) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
        await next(ApiError.UnauthorizedError("faild role", "no role"));
    } else {
        const { role } = user;
        if (permissions.includes(role)) {
            await next();
        } else {
            logger.error("error", "no premession")
            await next(ApiError.ForbiddenError("no permession"));
        }
    }
};


const getProductsList = async (req, res, next) => {
    const { userId } = req.user
    const user = await User.findById(userId)
    if (user) {
        const { role } = user
        if (role === "admin") {
            req.products = await Product.find()
        } else {
            req.products = await Product.find({ owner: userId })
        }
    } else {
        logger.error("user not founded")
        next(ApiError.NotFoundError("error", "user not found"))
    }

}

module.exports = {
    validationError,
    checkAuthToken,
    setPermissions,
    getProductsList

};