//import ./isArray
//import ./findout

/**
 * 删除数组中的空数据(like undefined/null/empty string)
 * @alias
 * @param {Array} o
 * @return {Array}
 * @example
 * var li = core_array_clear([1,2,3,undefined]);
 * li === [1,2,3];
 */
function core_array_clear(o){
    if (core_array_isArray(o)) {
        throw 'the clear function needs an array as first parameter';
    }
    var result = [];
    for (var i = 0, len = o.length; i < len; i += 1) {
        if (!(core_array_findout([undefined,null,''],o[i]).length)) {
            result.push(o[i]);
        }
    }
    return result;
};