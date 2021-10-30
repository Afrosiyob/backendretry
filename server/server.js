const express = require( "express" );
const winston = require( "winston" );
const { errorHandler } = require( "../src/errors/ErrorHandler" );
const morgan = require( "morgan" );
const { logger } = require( "../src/logger/logger" );
const path = require( "path" );
const { userRouter } = require( "../src/routes/user.routes" );
const mongoDb = require( "../connection/connectionMongo" );
const { authRouter } = require( "../src/routes/auth.routes" );
const { productRouter } = require( "../src/routes/product.routes" );
const { indexRouter } = require( "../src/routes/index.routes" );

const swaggerUi = require( 'swagger-ui-express' );
const swaggerJSDoc = require( 'swagger-jsdoc' );

// require('dotenv').config()
// create app server
const app = express()

const cors = require( 'cors' )

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Backend"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ],
    },
    apis: [ "../src/routes/*.js" ]
}


const swaggerSpec = swaggerJSDoc( options );

app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec ) );

// cors
app.use( cors() )

// set access json req.body
app.use( express.json( { extended: true } ) );
app.use( express.urlencoded( { extended: false } ) );

// second way create static files
app.use( "/public", express.static( path.join( __dirname, "public" ) ) );

// ANCHOR show request to console only development
if ( app.get( "env" ) === "development" ) {
    app.use( morgan( "tiny" ) );
    // Write log
    logger.add(
        new winston.transports.Console( {
            format: winston.format.simple(),
        } )
    );
}

app.use( "/", indexRouter );
app.use( "/api/user", userRouter );
app.use( "/api/product", productRouter );
app.use( "/api/auth", authRouter );




// ANCHOR error handler
app.use( errorHandler );

const { PORT = 5000, LOCAL_ADDRESS = '0.0.0.0' } = process.env


app.listen( PORT, LOCAL_ADDRESS, mongoDb );
