const jwt = require( "jsonwebtoken" );
const config = require( "config" );
const { v4: uuidv4 } = require( "uuid" );
const { logger } = require( "../logger/logger" );
const { Token } = require( "../models/models" );

const generateAccessToken = ( userId ) => ( {
    accessToken: jwt.sign( { userId: userId, type: "access" },
        config.get( "jwtSecret" ), { expiresIn: "3s" }
    ),
} );

const generateRefreshToken = () => {
    const tokenId = uuidv4();
    return {
        tokenId: tokenId,
        refreshToken: jwt.sign( { tokenId: tokenId, type: "refresh" },
            config.get( "jwtSecret" ), { expiresIn: "30d" }
        ),
    };
};

const replaceFromDBRefreshToken = async ( tokenId, userId ) => {
    try {
        return await Token.findOne( { UserId: userId }, ( err, token ) => {
            if ( token ) {
                return Token.findByIdAndRemove( token.id, () => Token.create( { tokenId: tokenId, UserId: userId } ) )
            } else {
                return Token.create( { tokenId: tokenId, UserId: userId } )
            }
        } )
    } catch ( error ) {
        logger.error( error );
    }
}


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceFromDBRefreshToken,
};