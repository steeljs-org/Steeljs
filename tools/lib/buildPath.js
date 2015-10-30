var path = require( 'path' );

module.exports = function( buidstr ) {
	return path.dirname( path.relative( path.resolve(), buidstr ) );
};

