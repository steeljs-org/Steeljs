//import ../event/addEventListener
/*
 * dom ready
 * @method core_dom_ready
 * @private
 * @param {Function} handler
 */
function core_dom_ready( handler ) {
	
	function DOMReady() {
		if ( DOMReady !== emptyFunction ) {
			DOMReady = emptyFunction;
			handler();
		}
	}
	
	if ( /complete/.test( document.readyState ) ) {
		handler();
	} else {
		if ( isAddEventListener ) {
			core_event_addEventListener( document, 'DOMContentLoaded', DOMReady );
		} else {
			core_event_addEventListener( document, 'onreadystatechange', DOMReady );

			//在跨域嵌套iframe时 IE8- 浏览器获取window.frameElement 会出现权限问题
			try {
				var _frameElement = window.frameElement;
			} catch (e) {}

			if ( _frameElement == null && docElem.doScroll ) {
				(function doScrollCheck() {
					try {
						docElem.doScroll( 'left' );
					} catch ( e ) {
						return setTimeout( doScrollCheck, 25 );
					}
					DOMReady();
				})();
			}
		}
		core_event_addEventListener( window, 'load', DOMReady );
	}
	
}