const { Router } = require("express")
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controller/product.controller")
const { validationError, checkAuthToken, getProductsList, setPermissions } = require("../middlewares/middlewares")
const { productCreateValidation, productUpdatedValidation } = require("../validations/product.validations")


const router = Router()

router.post("/create", checkAuthToken, productCreateValidation, validationError, createProduct)
router.get("/list", checkAuthToken, getProductsList, getProducts)
router.get("/:productId", checkAuthToken, getProduct)
router.put("/:productId", checkAuthToken, productUpdatedValidation, validationError, updateProduct)
router.delete("/:productId", checkAuthToken, setPermissions(["admin"]), deleteProduct)

module.exports = {
    productRouter: router
}