//import ./typeof
/*
 * 对象克隆
 * @method core_object_clone
 */
function core_object_clone( obj ) {
	
	var ret = obj;
	
	if ( core_object_typeof( obj ) === 'array' ) {
		ret = [];
		var i = obj.length;
		while ( i-- ) {
			ret[ i ] = core_object_clone( obj[ i ] );
		}
	} else if ( core_object_typeof( obj ) === 'object' ) {
		ret = {};
		for ( var k in obj ) {
			ret[ k ] = core_object_clone( obj[ k ] );
		}
	}
	
	return ret;
	
}
