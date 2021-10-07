const { createLogger, transports, format } = require("winston");

const logger = createLogger({
    transports: [new transports.File({ filename: "src/logs/combined.log" })],
    format: format.combine(
        format.colorize(),
        format.json()
    ),
    expressFormat: true,
});

module.exports = {
    logger,
};