const { check } = require( "express-validator" );

const userCreateValidation = [
    check( "username", "more thane 3 letters" ).isLength( { min: 3 } ),
    check( "password", "more thane 6 letters" ).isLength( { min: 6 } ),
];

module.exports = {
    userCreateValidation,
};