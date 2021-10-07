const { check } = require("express-validator");

const productCreateValidation = [
    check("name", "enter name").isLength({ min: 3 }),

];

const productUpdatedValidation = [
    check("name", "enter name").isLength({ min: 3 }),
    check("description", "enter name").exists()
]

module.exports = {
    productCreateValidation,
    productUpdatedValidation
};