/*
 * requestAnimationFrame
 * @method core_enterFrame
 * @private
 * @param {Function} fn
 */
var core_enterFrame = ( function() {
	var requestAnimationFrame = window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame;
	var enterFrame = function( fn ) {return setTimeout( fn, 2 )};
	
	//测试requestAnimationFrame的有效性
	requestAnimationFrame && requestAnimationFrame( function() {
		enterFrame = requestAnimationFrame;
	} );
	
	return function( fn ) {
		return enterFrame( function() {
			fn();
		} );
	}
} )();