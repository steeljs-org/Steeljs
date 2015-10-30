/*
 * query to json
 * @method core_queryToJson
 * @private
 * @param {string} query
 * @return {json} JSON
 * @example
 * var q1 = 'a=1&b=2&c=3';
 * core_queryToJson( q1 ) === {'a':1,'b':2,'c':3};
 */
function core_queryToJson( query ) {
	
	var queryList = query.split( '&' );
	var retJson  = {};
	
	for( var i = 0, len = queryList.length; i < len; ++i ){
		if ( queryList[ i ] ) {
			var hsh = queryList[ i ].split( '=' );
			var key = hsh[ 0 ];
			var value = hsh[ 1 ] || '';
			retJson[ key ] = retJson[ key ] ? [].concat( retJson[ key ], value ) : value;
		}
	}
	return retJson;
	
}
