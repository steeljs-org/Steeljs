//import ./object/typeof
/*
 * json to query
 * @method core_jsonToQuery
 * @private
 * @param {json} json
 * @return {string} query
 */
function core_jsonToQuery( json ) {
	
	var queryString = [];
	for ( var k in json ) {
		if ( core_object_typeof( json[ k ] ) === 'array' ) {
			for ( var i = 0, len = json[ k ].length; i < len; ++i ) {
				queryString.push( k + '=' + json[ k ][ i ] );
			}
		} else {
			queryString.push( k + '=' + json[ k ] );
		}
	}
	return queryString.join( '&' );
	
}