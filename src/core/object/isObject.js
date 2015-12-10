/**
 * is Object
 */

//import ./typeof

function core_object_isObject(value) {
    return core_object_typeof(value) === 'object';
}