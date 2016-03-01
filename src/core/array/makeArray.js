/*
 * 把类数组改变成数组
 * @method core_array_makeArray
 * @private
 * @param {arrayLike} obj
 *	需要查找的对象
 * @return {Array} 
 */
function core_array_makeArray( obj ) {
    return slice.call(obj, 0, obj.length);
}