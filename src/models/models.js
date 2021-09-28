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
    },
    firstName: {
        type: String,
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
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

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    owner: {
        type: String,
        ref: "User"
    }
})

module.exports = {
    User: model("User", userSchema),
    Token: model("Token", tokenSchema),
    Product: model("Product", productSchema)
}