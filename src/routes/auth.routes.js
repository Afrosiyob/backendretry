const { Router } = require("express");
const { authLogin, authLogout, authMe, refreshTokens } = require("../controller/auth.controller");
const { validationError, checkAuthToken } = require("../middlewares/middlewares");
const { authLoginValidation } = require("../validations/auth.validations");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: username of user
 *         password: 
 *           type: string
 *           description: password of user
 *       example:
 *           username: admin
 *           password: 1234567
 */

/**
 * GET /
 * @summary Homepage
 * @tags Login
 *
 * @return {object} 200 - success response
 * @example response - 200 - success response
 * {
 *     "success": true,
 * }
 */

/**
 * @openapi
 * /logout:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

router.post("/login", authLoginValidation, validationError, authLogin);

router.get("/logout", checkAuthToken, authLogout);

router.get("/me", checkAuthToken, authMe);

router.post("/refresh_tokens", refreshTokens);

module.exports = {
    authRouter: router,
};