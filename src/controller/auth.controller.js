const { User, Token } = require( "../models/models" );
const bcrypt = require( "bcryptjs" );
const { generateAccessToken, generateRefreshToken, replaceFromDBRefreshToken } = require( "../helpers/token.helper" );
const _ = require( "lodash" );
const jwt = require( "jsonwebtoken" );
const { logger } = require( "../logger/logger" );
const { ApiError } = require( "../errors/ApiError" );




const updateTokens = async ( userId ) => {
    const { accessToken } = generateAccessToken( userId );
    const { tokenId, refreshToken } = generateRefreshToken();
    await replaceFromDBRefreshToken( tokenId, userId );

    return {
        accessToken,
        refreshToken,
    };
};

// ANCHOR auth login controller
const authLogin = async ( req, res, next ) => {
    const { username, password } = req.body;
    const user = await User.findOne( { username } );
    if ( user === null ) {
        next( ApiError.NotFoundError( `${ username } not found` ) );
    } else {
        const isMatchPassword = await bcrypt.compare( password, user.password );
        if ( !isMatchPassword ) {
            next(
                ApiError.BadRequestError(
                    "failed password",
                    "please enter currect password"
                )
            );
        } else {
            const { id } = user;
            const token_info = await updateTokens( id ).then( ( tokens ) => tokens );
            res.status( 200 ).json( {
                data: {
                    token_info,
                    user_info: _.pick( user, [ "username", "role" ] ),
                },
                message: "user info ",
            } );
        }
    }
};


const authLogout = async ( req, res, next ) => {
    const { userId } = req.user
    try {
        await Token.findOne( { UserId: userId }, ( err, token ) => {
            if ( token ) {
                Token.findByIdAndRemove( token.id, ( err ) => {
                    if ( err ) {
                        logger.error( err )
                        next( ApiError.BadRequestError( err, "user not logged out" ) );
                    } else {
                        res.status( 200 ).json( { message: "user logged out" } )
                    }
                } )
            } else {
                logger.error( err )
                next( ApiError.BadRequestError( err, "user not founded" ) );
            }
        } )
    } catch ( error ) {
        logger.error( error )
        next( ApiError.ServerError( "server error" ) )
    }
}

const refreshTokens = async ( req, res, next ) => {
    const { refreshToken } = req.body
    let decoded
    try {
        decoded = jwt.verify( refreshToken, config.get( "jwtSecret" ) )
        const { type } = decoded
        if ( type && type !== "refresh" ) {
            next( ApiError.BadRequestError( "error", "this is not refresh token" ) )
        }
    } catch ( error ) {
        if ( error instanceof jwt.TokenExpiredError ) {
            next( ApiError.BadRequestError( error, "token exparied" ) )
        } else if ( error instanceof jwt.JsonWebTokenError ) {
            next( ApiError.BadRequestError( error, "invalid token" ) )
        }
    }

    const { tokenId } = decoded

    await Token.findOne( { tokenId }, async ( err, token ) => {
        if ( token ) {
            const { UserId } = token
            const tokens = await updateTokens( UserId );
            return res.status( 200 ).json( {
                message: "new tokens",
                data: tokens
            } );
        } else {
            logger.error( err )
            next( ApiError.BadRequestError( err, "not founded token from DB" ) );
        }
    } )

}

const authMe = async ( req, res, next ) => {
    const { userId } = req.user;
    try {
        const user = await User.findById( userId )
        if ( !user ) {
            next( ApiError.UnauthorizedError( "failid token", "wrong or invalid token" ) );
        } else {
            res.status( 200 ).json( {
                data: { user_info: _.pick( user, [ "username", "role" ] ) },
                message: "user info",
            } );
        }
    } catch ( error ) {
        logger.error( error )
        next( ApiError.ServerError( "server error" ) )
    }
}


module.exports = {
    authLogin,
    authLogout,
    refreshTokens,
    authMe
}