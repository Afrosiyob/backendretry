const { Router } = require("express")
const { createUser, getUsers, getUser } = require("../controller/user.controller")
const { validationError } = require("../middlewares/middlewares")
const { userCreateValidation } = require("../validations/user.validations")

const router = Router()

router.post("/create", userCreateValidation, validationError, createUser)
router.get("/list", getUsers)
router.get("/:userId", getUser)
// router.put("/:userId")
// router.delete("/:userId")

module.exports = {
    userRouter: router
}