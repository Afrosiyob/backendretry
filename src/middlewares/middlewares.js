
const { validationResult } = require("express-validator");
const { ApiError } = require("../errors/ApiError");

const validationError = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(ApiError.BadRequestError(errors.array(), "badrequest error"));
    } else {
        await next();
    }
};


module.exports = {
    validationError,

};