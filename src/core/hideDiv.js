//import ./dom/createElement

var core_hideDiv_hideDiv;
/*
 * 向隐藏容器添加节点
 * @method core_hideDiv_appendChild
 * @private
 * @param {Element} el 节点
 */
function core_hideDiv_appendChild( el ) {
	if ( !core_hideDiv_hideDiv ) {
		( core_hideDiv_hideDiv = core_dom_createElement( 'div' ) ).style.cssText = 'position:absolute;top:-9999px;';
		head.appendChild( core_hideDiv_hideDiv );
	}
	core_hideDiv_hideDiv.appendChild( el );
}

/*
 * 向隐藏容器添加节点
 * @method core_hideDiv_removeChild
 * @private
 * @param {Element} el 节点
 */
function core_hideDiv_removeChild( el ) {
	core_hideDiv_hideDiv && core_hideDiv_hideDiv.removeChild( el );
}
