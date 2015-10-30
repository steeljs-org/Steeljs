/**
 * @param {Object} o
 * @param {boolean} isprototype 继承的属性是否也在检查之列
 * @example
 * core_obj_isEmpty({}) === true;
 * core_obj_isEmpty({'test':'test'}) === false;
 */
function core_obj_isEmpty(o,isprototype){
    for(var k in o){
        if(isprototype || o.hasOwnProperty(k)){
            return false;
        }
    }
    return true;
}