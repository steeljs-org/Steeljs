//import core/object/typeof

/**
 * arguments 简单多态 要求参数顺序固定
 * @param  {Arguments} args  参数对象
 * @param  {array} keys  参数名数组
 * @param  {array} types 类型数组 array/object/number/string/function
 * @return {object}      使用参数key组成的对象
 * @example
 * function test(a, b, c, d, e) {
 *    console.log(core_argsPolymorphism(arguments, ['a', 'b', 'c', 'd', 'e'], ['number', 'string', 'function', 'array', 'object']));
 * }
 * test(45, 'a', undefined, [1,3], {xxx:343}) => Object {a: 45, b: "a", d: Array[2], e: Object}
 */
function core_argsPolymorphism(args, keys, types) {
    var result = {};
    var newArgs = [];
    var typeIndex = 0;
    var typeLength = types.length;
    for (var i = 0, l = args.length; i < l; ++i) {
        var arg = args[i];
        if (arg === undefined || arg === null) {
            continue;
        }
        for (; typeIndex < typeLength; ++typeIndex) {
            if (core_object_typeof(arg) === types[typeIndex]) {
                result[keys[typeIndex]] = arg;
                ++typeIndex;
                break;
            }
        }
        if (typeIndex >= typeLength) {
            break;
        }
    }
    return result;
}
