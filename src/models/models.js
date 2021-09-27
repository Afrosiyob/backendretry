const { Schema, model, Types } = require("mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "user"
    }
})

const tokenSchema = new Schema({
    tokenId: {
        type: String,
    },
    UserId: {
        type: String
    }
})

module.exports = {
    User: model("User", userSchema),
    Token: model("Token", tokenSchema)
}