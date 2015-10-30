/**
 * 日志
 */
//import base

function core_log() {
	var console = window.console;
	if (!isDebug || !console) {
		return;
	}
	var evalString = [];
	for (var i = 0, l = arguments.length; i < l; ++i) {
		evalString.push('arguments[' + i + ']');
	}
	new Function('console.log(' + evalString.join(',') + ')').apply(this, arguments);
}