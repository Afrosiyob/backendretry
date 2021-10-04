const { Router } = require("express")
const { createProduct } = require("../controller/product.controller")
const { validationError, checkAuthToken, getProductsList } = require("../middlewares/middlewares")
const { productCreateValidation } = require("../validations/product.validations")


const router = Router()

router.post("/create", productCreateValidation, validationError, createProduct)
// router.get("/list", checkAuthToken, getProductsList, getProducts)
// router.get("/:productId", checkAuthToken, getProducts)
// router.put("/:productId", checkAuthToken, updateProduct)
// router.delete("/:productId", checkAuthToken, deleteProduct)

module.exports = {
    productRouter: router
}