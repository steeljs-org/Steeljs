/*
 * typeof
 */
function core_object_typeof( value ) {
	return value === null ? '' : Object.prototype.toString.call( value ).slice( 8, -1 ).toLowerCase();
}