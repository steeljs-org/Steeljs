/*
 * dom事件解绑定
 * @method core_event_removeEventListener
 * @private
 * @param {Element} el
 * @param {string} type
 * @param {string} fn
 */
var core_event_removeEventListener = isAddEventListener ?
	function( el, type, fn ) {
		el.removeEventListener( type, fn, false );
	}
	:
	function( el, type, fn ) {
		el.detachEvent( 'on' + type, fn );
	};