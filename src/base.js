
var steel = window.steel || {
    v : 0.1,
    t : now()
};

var userAgent = navigator.userAgent,
    document = window.document,
    docElem = document.documentElement,
    head = document.head || getElementsByTagName( 'head' )[ 0 ] || docElem,
    setTimeout = window.setTimeout,
    clearTimeout = window.clearTimeout,
    parseInt = window.parseInt,
    parseFloat = window.parseFloat,
    location = window.location,
    decodeURI = window.decodeURI,
    toString = Object.prototype.toString,
    isHTML5 = !!history.pushState,
    webkit = userAgent.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
    webkitVersion = webkit && parseFloat(webkit[1]),
    iphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/),
    iphoneVersion = iphone && parseFloat(iphone[2].replace(/_/g, '.')),
    android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
    androidVersion = android && parseFloat(android[2]),
    isAddEventListener = document.addEventListener,
    isDebug,
    logLevels = 'Debug|Info|Warn|Error|Fatal',
    logLevel = 'Info',
    logNotice = 'logNotice',
    IE = /msie (\d+\.\d+)/i.test( userAgent ) ? ( document.documentMode || + RegExp[ '$1' ] ) : 0;

var mainBox;

//检验history.state的支持性
if (isHTML5) {
    (function() {
        var lastState = history.state;
        history.replaceState(1, undefined);
        isHTML5 = (history.state === 1);
        history.replaceState(lastState, undefined);
    })();
}

/*
 * log
 */
function log() {
    var console = window.console;
    //只有debug模式打日志
    if (!isDebug || !console) {
        return;
    }
    var args = arguments;
    if (!RegExp('^(' + logLevels.slice(logLevels.indexOf(logLevel)) + ')').test(args[0])) {
        return;
    }
    var evalString = [];
    for (var i = 0, l = args.length; i < l; ++i) {
        evalString.push('arguments[' + i + ']');
    }
    new Function('console.log(' + evalString.join(',') + ')').apply(this, args);
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
    return Date.now ? Date.now() : +new Date;
}

function RegExp(pattern, attributes) {
    return new window.RegExp(pattern, attributes);
}