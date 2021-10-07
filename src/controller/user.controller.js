const { ApiError } = require("../errors/ApiError");
const { logger } = require("../logger/logger");
const { User } = require("../models/models");
const bcrypt = require("bcryptjs");

const createUser = async (req, res, next) => {
    try {
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
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}

const getUsers = async (req, res, next) => {
    try {
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
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
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
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName
            }
        })
    } catch (error) {
        logger.error(error);
        next(ApiError.BadRequestError(error, "wrong user id"));
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { username, password, firstName, middleName, lastName } = req.body
        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedUser = await User.findByIdAndUpdate(userId, { username, password: hashedPassword, firstName, middleName, lastName }, { new: true })
        if (!updatedUser) {
            logger.error("error", "user cannot updated")
            next(ApiError.NotFoundError("user not founded"))
        } else {
            res.status(200).json({
                message: "user updated",
                data: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    middleName: updatedUser.middleName
                }
            })
        }
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const deletedUser = await User.findByIdAndRemove(userId)
        if (deletedUser) {
            res.status(200).json({
                message: "user success deleted"
            })
        } else {
            logger.error("error", "user can not deleted")
            next(ApiError.BadRequestError("error", "user cannot deleted or cannot founded this user"))
        }
    } catch (error) {
        logger.error(error)
        next(ApiError.ServerError("server error"))
    }
}


module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}