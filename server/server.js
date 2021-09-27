const express = require("express");

const winston = require("winston");
const config = require("config");
const { errorHandler } = require("../src/errors/ErrorHandler");
const morgan = require("morgan");
const { logger } = require("../src/logger/logger");
const path = require("path");
const { userRouter } = require("../src/routes/user.routes");
const mongoDb = require("../connection/connectionMongo");
// create app server
const app = express()

// set access json req.body
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));


// second way create static files
app.use("/public", express.static(path.join(__dirname, "public")));


// ANCHOR show request to console only development
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    // Write log
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

app.use("/api/user", userRouter);

// ANCHOR error handler
app.use(errorHandler);

const PORT = config.get("PORT") || process.env.PORT || 5000;

app.listen(PORT, mongoDb);