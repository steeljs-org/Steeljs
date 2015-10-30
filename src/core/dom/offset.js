/*
 * dom offset
 * @method core_dom_offset
 * @private
 * @param {Element}
 * @desc  等位元素距离浏览器document的位置
 */
function core_dom_offset( el ) {
	var box = {top: 0, left: 0};
	
	if (typeof el.getBoundingClientRect !== undefined + '') {
		box = el.getBoundingClientRect();
	}
	
	return {
		top: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	}
}
