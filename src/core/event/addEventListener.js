/*
 * dom事件绑定
 * @method core_event_addEventListener
 * @private
 * @param {Element} el
 * @param {string} type
 * @param {string} fn
 */
var core_event_addEventListener = isAddEventListener ? 
	function( el, type, fn ) {
		el.addEventListener( type, fn, false );
	}
	:
	function( el, type, fn ) {
		el.attachEvent( 'on' + type, fn );
	};
