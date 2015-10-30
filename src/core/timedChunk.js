/*
 * 分时处理
 * @method core_timedChunk
 * @private
 * @param {Array} items
 * @param {Function} process
 */
function core_timedChunk( items, process ) {
	var todo = items.concat();
	
	( function delayFunction() {
		var start = now();
		while ( todo.length > 0 && ( now() - start < 50 ) ) {
			process && process( todo.shift() );
		}
		if ( todo.length > 0 ) {
			setTimeout( delayFunction, 25 );
		}
	} )();
	
//	setTimeout( delayFunction, delay );
}
