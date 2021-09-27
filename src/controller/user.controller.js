const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");
const { User } = require("../models/models");
const bcrypt = require("bcryptjs");

const createUser = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (user) {
        if (user instanceof User) {
            logger.error("same username");
            next(
                ApiError.BadRequestError(
                    `failed ${username}`,
                    "please enter other username"
                )
            );
        }
    } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save();
        res.status(201).json({
            message: "yangi chichqo yaratildi 💩 😂",
            data: newUser
        });
    }
}

module.exports = {
    createUser
}