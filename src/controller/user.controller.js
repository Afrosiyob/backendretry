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
            data: {
                id: newUser.id,
                username: newUser.username
            }
        });
    }
}

const getUsers = async (req, res, next) => {
    const users = await User.find()
    if (users) {
        res.status(200).json({
            message: "all users",
            data: users.map(el => ({
                id: el.id,
                username: el.username
            }))
        })
    } else {
        logger.error(error);
        next(ApiError.NotFoundError("user not founded or some error"));
    }
}

const getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
        res.status(200).json({
            message: "single user data",
            data: {
                id: user.id,
                username: user.username
            }
        })
    } catch (error) {
        logger.error(error);
        next(ApiError.BadRequestError(error, "wrong user id"));
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser
}