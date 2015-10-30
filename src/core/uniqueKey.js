var core_uniqueKey_index = 1;
var core_uniqueKey_prefix = 'SL_' + now();

/*
 * 唯一字符串
 * @method core_uniqueKey
 * @private
 * @return {string}
 */
function core_uniqueKey() {
	return core_uniqueKey_prefix + core_uniqueKey_index++;
}
