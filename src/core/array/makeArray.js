/*
 * 把类数组改变成数组
 * @method core_array_makeArray
 * @private
 * @param {arrayLike} obj
 *	需要查找的对象
 * @return {Array} 
 */
function core_array_makeArray( obj ) {
	try {
		return [].slice.call(obj);
	} catch (e) { //for IE
		var j, i = 0, rs = [];
		while ( j = obj[i] ){
			rs[i++] = j;
		}
		return rs;
	}
}