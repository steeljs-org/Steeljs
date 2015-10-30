/*
 * 删除数组里的某些元素
 * @method core_array_delete
 * @private
 * @param {Array} oElement 
 * @param {Any} oElement 
 *  需要查找的对象
 * @return {Array} 
 *  清理后的数组
 */
 //import ./isArray
 //import ./clear
function core_array_delete( oElement, aSource ) {
    if( !core_array_isArray ){
        throw 'the delete function needs an array as second parameter'
    }
    for( var i = 0, len = aSource.length; i < len; i++ ){
        if( oElement === aSource[i] ){
            delete aSource[i]
        }
    }
    return core_array_clear(aSource);
}
