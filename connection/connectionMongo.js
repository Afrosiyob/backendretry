const mongoose = require("mongoose")
const config = require("config")
const mongoDb = async () => await mongoose.connect(config.get("mongoUri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("mongodb is connecting 😂");
    console.log("server is running 😂");
})

module.exports = mongoDb
