const { Router } = require( "express" )
const { createUser, getUsers, getUser, updateUser, deleteUser } = require( "../controller/user.controller" )
const { validationError, checkAuthToken, setPermissions } = require( "../middlewares/middlewares" )
const { userCreateValidation } = require( "../validations/user.validations" )

const router = Router()


/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    required:
 *     - username
 *     - password
 *    properties:
 *     id:
 *      type:string
 *     username:
 *      type:string,
 *     password:
 *      type:string
 *    example:
 *      id: 615993fed23fa6696c5fdaca
 *      username: admin
 *      password: 2230102ab
 *
 */


router.post( "/create", userCreateValidation, validationError, createUser )
router.get( "/list", checkAuthToken, setPermissions( [ "admin" ] ), getUsers )
router.get( "/:userId", checkAuthToken, setPermissions( [ "admin" ] ), getUser )
router.put( "/:userId", checkAuthToken, setPermissions( [ "admin" ] ), updateUser )
router.delete( "/:userId", checkAuthToken, setPermissions( [ "admin" ] ), deleteUser )

module.exports = {
    userRouter: router
}