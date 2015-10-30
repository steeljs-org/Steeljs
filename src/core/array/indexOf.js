/*
 * 返回在数组中的索引
 * @method core_array_indexOf
 * @private
 * @param {Array} oElement 
 * @param {Any} oElement 
 *	需要查找的对象
 * @return {Number} 
 *	在数组中的索引,-1为未找到
 */
function core_array_indexOf( oElement, aSource ) {
	if ( aSource.indexOf ) {
		return aSource.indexOf( oElement );
	}
	for ( var i = 0, len = aSource.length; i < len; ++i ) {
		if ( aSource[ i ] === oElement ) {
			return i;
		}
	}
	return -1;
}
