//import core/object/typeof

/**
 * 判断对象是否为数组
 * @param {Array} o
 * @return {Boolean}
 * @example
 * var li1 = [1,2,3]
 * var bl2 = core_array_isArray(li1);
 * bl2 === TRUE
 */
var core_array_isArray = Array.isArray ? function(arr) {
	return Array.isArray(arr);
} : function(arr){
	return 'array' === core_object_typeof(arr);
};