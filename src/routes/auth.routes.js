const { Router } = require("express");
const { authLogin, authLogout, authMe, refreshTokens } = require("../controller/auth.controller");
const { validationError, checkAuthToken } = require("../middlewares/middlewares");
const { authLoginValidation } = require("../validations/auth.validations");

const router = Router();

router.post("/login", authLoginValidation, validationError, authLogin);
router.get("/logout", checkAuthToken, authLogout);
router.get("/me", checkAuthToken, authMe);
router.post("/refresh_tokens", refreshTokens);

module.exports = {
    authRouter: router,
};