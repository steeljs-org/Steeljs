/**
 * 查找指定元素在数组内的索引
 * @param {Array} o
 * @param {String|Number|Object|Boolean|Function} value
 * @return {Array}
    索引值的数组
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = core_array_findout(li1,'a');
 */

//import ./isArray
function core_array_findout(o, value){
    if (!core_array_isArray(o)) {
        throw 'the findout function needs an array as first parameter';
    }
    var k = [];
    for (var i = 0, len = o.length; i < len; i += 1) {
        if (o[i] === value) {
            k.push(i);
        }
    }
    return k;
};
