/*
 * 合并参数，不影响源
 * @param {Object} oSource 需要被赋值参数的对象
 * @param {Object} oParams 传入的参数对象 
 * @param {Boolean} isown 是否仅复制自身成员，不复制prototype，默认为false，会复制prototype
*/
function core_object_parseParam(oSource, oParams, isown){
    var key, obj = {};
    oParams = oParams || {};
    for (key in oSource) {
        obj[key] = oSource[key];
        if (oParams[key] != null) {
            if (isown) {// 仅复制自己
                if (oSource.hasOwnProperty(key)) {
                    obj[key] = oParams[key];
                }
            } else {
                obj[key] = oParams[key];
            }
        }
    }
    return obj;
}