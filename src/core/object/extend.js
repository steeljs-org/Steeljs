//import ./isString

/**
 * 扩展内容
 */

function core_object_extend(target, key, value) {
    if (core_object_isString(key)) {
        target[key] = value;
    } else {
        for (var _key in key) {
            target[_key] = key[_key];
        }
    }
    return target;
}