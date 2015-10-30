
var steel = window.steel || {
    v : 0.1,
    t : now()
};



var userAgent = navigator.userAgent,
    document = window.document,
    docElem = document.documentElement,
    head = document.head || getElementsByTagName( 'head' )[ 0 ] || docElem,
    setTimeout = window.setTimeout,
    location = window.location,
    clearTimeout = window.clearTimeout,
    decodeURI = window.decodeURI,
    toString = Object.prototype.toString,
    isHTML5 = !!history.pushState,
    android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
    isAddEventListener = document.addEventListener,
    isDebug,
    logNotice = 'logNotice',
    IE = /msie (\d+\.\d+)/i.test( userAgent ) ? ( document.documentMode || + RegExp[ '$1' ] ) : 0;

var mainBox;

/*
 * log
 */
function log() {
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
/*
 * 空白方法
 */
function emptyFunction() {}
/*
 * id取节点
 * @method getElementById
 * @private
 * @param {string} id
 */
function getElementById( id ) {
    return document.getElementById( id );
}

/*
 * tagName取节点
 * @method getElementsByTagName
 * @private
 * @param {string} tagName
 */
function getElementsByTagName( tagName, el ) {
    return ( el || document ).getElementsByTagName( tagName );
}

/*
 * now
 * @method now
 * @private
 * @return {number} now time
 */
function now() {
    return Date.now ? Date.now() : +new Date();
}