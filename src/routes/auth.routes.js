const { Router } = require( "express" );
const { authLogin, authLogout, authMe, refreshTokens } = require( "../controller/auth.controller" );
const { validationError, checkAuthToken } = require( "../middlewares/middlewares" );
const { authLoginValidation } = require( "../validations/auth.validations" );

const router = Router();

/**
 * @swagger
 * /auth:
 *  get:
 *   description: Use to auth
 *   response:
 *    '200':
 *     description: A successful response
 * 
 *      
 */

router.post( "/login", authLoginValidation, validationError, authLogin );
router.get( "/logout", checkAuthToken, authLogout );
router.get( "/me", checkAuthToken, authMe );
router.post( "/refresh_tokens", refreshTokens );

module.exports = {
    authRouter: router,
};