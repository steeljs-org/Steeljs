//import ./uniqueKey
//污染到对象上的属性定义
var core_uniqueID_attr = '__SL_ID';
/*
 * 得到对象对应的唯一key值
 * @method core_uniqueID
 * @private
 * @return {string}
 */
function core_uniqueID( obj ) {
	return obj[ core_uniqueID_attr ] || ( obj[ core_uniqueID_attr ] = core_uniqueKey() );
}