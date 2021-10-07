const { Router } = require("express")

const router = Router()

router.get("/", (req, res, next) => {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("hello world")
})

module.exports = {
    indexRouter: router
}