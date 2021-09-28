const { check } = require("express-validator");

const productCreateValidation = [
    check("name", "enter name").isLength({ min: 3 }),

];

module.exports = {
    productCreateValidation,
};