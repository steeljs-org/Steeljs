/*
 * JSON copy
 * @method core_jsonCopy
 */
function core_jsonCopy( json ) {
	var buf;
	if ( json instanceof Array ) {
		buf = [];
		var i = json.length;
		while ( i-- ) {
			buf[i] = core_jsonCopy( json[i] );
		}
		return buf;
	} else if ( json instanceof Object ) {
		buf = {};
		for ( var k in json ) {
			buf[k] = core_jsonCopy( json[k] );
		}
		return buf;
	} else {
		return json;
	}
}
