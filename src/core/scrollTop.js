/*
 * 页面滚动top位置
 * @method core_scrollTop
 * @private
 * @return {number}
 */
function core_scrollTop() {
	return Math.max( window.pageYOffset || 0, docElem.scrollTop, document.body.scrollTop );
}