/**
 * Steel Hybrid SPA
 */
! function(window, undefined) {
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
    slice = [].slice,
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
var config_list = [];
function config(config) {
  var parseParamFn = config_parseParamFn(config);
  for (var i = 0, l = config_list.length; i < l; ++i) {
    config_list[i](parseParamFn, config);
  }
}
function config_push(fn) {
  config_list.push(fn);
}
function config_parseParamFn(config) {
  return function(key, defaultValue) {
    if (key in config) {
      return config[key];
    }
    return defaultValue;
  };
}
 //模块相关全局变量
var require_base_module_deps = {};
var require_base_module_fn = {};
var require_base_module_loaded = {};
var require_base_module_defined = {};
var require_base_module_runed = {};
//事件
var require_base_event_defined = '-require-defined';
var require_global_loadingNum = 0;/*
 * parse URL
 * @method core_parseURL
 * @private
 * @param {string} str 
 *    可以传入 protocol//host 当protocol不写时使用location.protocol; 
 * @return {object}
 * @example
 * core_parseURL( 'http://t.sina.com.cn/profile?beijing=huanyingni' ) === 
	{
		hash : ''
		host : 't.sina.com.cn'
		path : '/profile'
		port : ''
		query : 'beijing=huanyingni'
		protocol : http
		href : 'http://t.sina.com.cn/profile?beijing=huanyingni'
	}
 */
function core_parseURL(url) {
    var parse_url = /^(?:([a-z]+:)?(\/{2,3})([0-9.\-a-z-]+)(?::(\d+))?)?(\/?[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i;
    var names = ["url", "protocol", "slash", "host", "port", "path", "query", "hash"];
    var results = parse_url.exec(url);
    var retJson = {};
    if (!results) {
        log('Error:parseURL:"' + url + '" is wrong!');
        return;
    }
    for (var i = 0, len = names.length; i < len; i += 1) {
        retJson[names[i]] = results[i] || "";
    }
    if (retJson.host) {
        retJson.protocol = retJson.protocol || location.protocol;
        retJson.port = retJson.port || 80;
    }
    if (retJson.port) {
        retJson.port = parseInt(retJson.port);
    }
    retJson.path = retJson.path.replace(/\/+/g, '/') || '/';
    return retJson;
}/*
 * query to json
 * @method core_queryToJson
 * @private
 * @param {string} query
 * @return {json} JSON
 * @example
 * var q1 = 'a=1&b=2&c=3';
 * core_queryToJson( q1 ) === {'a':1,'b':2,'c':3};
 */
function core_queryToJson( query ) {
	var queryList = query.split( '&' );
	var retJson  = {};
	for( var i = 0, len = queryList.length; i < len; ++i ){
		if ( queryList[ i ] ) {
			var hsh = queryList[ i ].split( '=' );
			var key = hsh[ 0 ];
			var value = hsh[ 1 ] || '';
			retJson[ key ] = retJson[ key ] ? [].concat( retJson[ key ], value ) : value;
		}
	}
	return retJson;
}/*
 * typeof
 */
function core_object_typeof( value ) {
	return value === null ? '' : Object.prototype.toString.call( value ).slice( 8, -1 ).toLowerCase();
}
/*
 * json to query
 * @method core_jsonToQuery
 * @private
 * @param {json} json
 * @return {string} query
 */
function core_jsonToQuery( json ) {
	var queryString = [];
	for ( var k in json ) {
		if ( core_object_typeof( json[ k ] ) === 'array' ) {
			for ( var i = 0, len = json[ k ].length; i < len; ++i ) {
				queryString.push( k + '=' + json[ k ][ i ] );
			}
		} else {
			queryString.push( k + '=' + json[ k ] );
		}
	}
	return queryString.join( '&' );
}/**
 * is String
 */
function core_object_isString(value) {
    return core_object_typeof(value) === 'string';
}
/**
 * 扩展内容
 */
function core_object_extend(target, key, value) {
    if (core_object_isString(key)) {
        target[key] = value;
    } else {
        for (var _key in key) {
            target[_key] = key[_key];
        }
    }
    return target;
}/**
 * 判断地址中是否有协议
 * @param  {string} url 
 * @return {boolean} 
 */
function core_hasProtocol(url) {
    return /^([a-z]+:)?\/\/\w+/i.test(url);
}
/*
 * 根据相对路径得到绝对路径
 * @method core_fixUrl
 * @private
 * @return {String}
 */
function core_fixUrl(baseUrl, path) {
    baseUrl = baseUrl || '.';
    var baseUrlJson = core_parseURL(baseUrl);
    var origin;
    if (baseUrlJson.path.indexOf('/') !== 0) {
        baseUrl = core_fixUrl(location.href, baseUrl);
        baseUrlJson = core_parseURL(baseUrl);
    }
    if (baseUrlJson.protocol) {
        origin = baseUrlJson.protocol + '//' + baseUrlJson.host + (baseUrlJson.port === 80 ? '' : (':' + baseUrlJson.port));
    } else {
        origin = origin = location.origin || location.toString().replace(/^([^\/]*\/\/[^\/]*)\/.*$/, '$1');
        baseUrl = origin + baseUrl;
    }
    var originPath = origin + '/';
    var basePath = baseUrlJson.path;
    basePath = origin + (basePath.indexOf('/') === 0 ? '' : '/') + basePath.slice(0, basePath.lastIndexOf('/') + 1);
    if (core_hasProtocol(path)) {
        return path;
    }
    if (path === '/') {
        return originPath;
    }
    if (path === '.' || path === '') {
        return baseUrl;
    }
    if (path.indexOf('./') === 0) {
        path = path.replace(/^\.\//, '');
        return basePath + path;
    }
    if (path === '..') {
        path = path.replace(/\.\./, '');
        basePath = core_fixUrl_handleTwoDots(basePath);
        return basePath + path;
    }
    if (path.indexOf('?') === 0) {
        return origin + baseUrlJson.path + path;
    }
    if (path.indexOf('&') === 0) {
        return origin + baseUrlJson.path + '?' + core_jsonToQuery(core_object_extend(core_queryToJson(baseUrlJson.query), core_queryToJson(path)));
    }
    if (/^\/[^\/]+/.test(path)) {
        return origin + path;
    }
    while (path.indexOf('../') === 0) {
        if (originPath === basePath) {
            path = path.replace(/(\.\.\/)/g, '');
            basePath = originPath;
            break;
        }
        path = path.replace(/^\.\.\//, '');
        basePath = core_fixUrl_handleTwoDots(basePath);
    }
    return basePath + path;
}
function core_fixUrl_handleTwoDots(url) {
    url = url.charAt(url.length - 1) === '/' ? (url.slice(0, url.length - 1)) : url;
    return url.slice(0, url.lastIndexOf('/') + 1);
}
/**
 * Describe 对url进行解析变化
 * @id  core_URL
 * @alias
 * @param {String} url
 * @param {Object} 
    {
        'isEncodeQuery'  : {Boolean}, //对query编码
        'isEncodeHash'   : {Boolean}  //对hash编码
    }
 * @return {Object}
    {
        setParam    : {Function}
        getParam    : {Function}
        setParams   : {Function}
        setHash     : {Function}
        getHash     : {Function}
        toString    : {Function}
    }
 * @example
 *  alert(
 *      core_URL('http://abc.com/a/b/c.php?a=1&b=2#a=1').
 *      setParam('a', 'abc').
 *      setHash('a', 67889).
 *      setHash('a1', 444444).toString()
 *  );
 */
/*
 * 合并参数，不影响源
 * @param {Object} oSource 需要被赋值参数的对象
 * @param {Object} oParams 传入的参数对象 
 * @param {Boolean} isown 是否仅复制自身成员，不复制prototype，默认为false，会复制prototype
*/
function core_object_parseParam(oSource, oParams, isown){
    var key, obj = {};
    oParams = oParams || {};
    for (key in oSource) {
        obj[key] = oSource[key];
        if (oParams[key] != null) {
            if (isown) {// 仅复制自己
                if (oSource.hasOwnProperty(key)) {
                    obj[key] = oParams[key];
                }
            } else {
                obj[key] = oParams[key];
            }
        }
    }
    return obj;
}
function core_URL(sURL,args){
    var opts = core_object_parseParam({
        'isEncodeQuery'  : false,
        'isEncodeHash'   : false
    },args||{});
    var retJson = {};
    var url_json = core_parseURL(sURL);
    var query_json = core_queryToJson(url_json.query);
    var hash_json = core_queryToJson(url_json.hash);
    /**
     * Describe 设置query值
     * @method setParam
     * @param {String} sKey
     * @param {String} sValue
     * @example
     */
    retJson.setParam = function(sKey, sValue){
        query_json[sKey] = sValue;
        return this;
    };
    /**
     * Describe 取得query值
     * @method getParam
     * @param {String} sKey
     * @example
     */
    retJson.getParam = function(sKey){
        return query_json[sKey];
    };
    /**
     * Describe 设置query值(批量)
     * @method setParams
     * @param {Json} oJson
     * @example
     */
    retJson.setParams = function(oJson){
        for (var key in oJson) {
            retJson.setParam(key, oJson[key]);
        }
        return this;
    };
    /**
     * Describe 设置hash值
     * @method setHash
     * @param {String} sKey
     * @param {String} sValue
     * @example
     */
    retJson.setHash = function(sKey, sValue){
        hash_json[sKey] = sValue;
        return this;
    };
    /**
     * Describe 设置hash值
     * @method getHash
     * @param {String} sKey
     * @example
     */
    retJson.getHash = function(sKey){
        return hash_json[sKey];
    };
    /**
     * Describe 取得URL字符串
     * @method toString
     * @example
     */
    retJson.valueOf = retJson.toString = function(){
        var url = [];
        var query = core_jsonToQuery(query_json, opts.isEncodeQuery);
        var hash = core_jsonToQuery(hash_json, opts.isEncodeQuery);
        if (url_json.protocol) {
            url.push(url_json.protocol);
            url.push(url_json.slash);
        }
        if (url_json.host != '') {
            url.push(url_json.host);
            if(url_json.port != ''){
                url.push(':');
                url.push(url_json.port);
            }
        }
        // url.push('/');
        url.push(url_json.path);
        if (query != '') {
            url.push('?' + query);
        }
        if (hash != '') {
            url.push('#' + hash);
        }
        return url.join('');
    };
    return retJson;
};/**
 * 资源变量
 */
var resource_jsPath;
var resource_cssPath;
var resource_ajaxPath;
var resource_basePath;
var resource_base_apiRule;
var resource_base_version;
//资源列表{url->[[access_cb, fail_cb],....]}
var resource_queue_list = {};
//router资源
var core_uniqueKey_index = 1;
var core_uniqueKey_prefix = 'SL_' + now();
/*
 * 唯一字符串
 * @method core_uniqueKey
 * @private
 * @return {string}
 */
function core_uniqueKey() {
	return core_uniqueKey_prefix + core_uniqueKey_index++;
}
//污染到对象上的属性定义
var core_uniqueID_attr = '__SL_ID';
/*
 * 得到对象对应的唯一key值
 * @method core_uniqueID
 * @private
 * @return {string}
 */
function core_uniqueID( obj ) {
	return obj[ core_uniqueID_attr ] || ( obj[ core_uniqueID_attr ] = core_uniqueKey() );
}/*
 * 返回在数组中的索引
 * @method core_array_indexOf
 * @private
 * @param {Array} oElement 
 * @param {Any} oElement 
 *	需要查找的对象
 * @return {Number} 
 *	在数组中的索引,-1为未找到
 */
function core_array_indexOf( oElement, aSource ) {
	if ( aSource.indexOf ) {
		return aSource.indexOf( oElement );
	}
	for ( var i = 0, len = aSource.length; i < len; ++i ) {
		if ( aSource[ i ] === oElement ) {
			return i;
		}
	}
	return -1;
}
/*
 * 把类数组改变成数组
 * @method core_array_makeArray
 * @private
 * @param {arrayLike} obj
 *	需要查找的对象
 * @return {Array} 
 */
function core_array_makeArray( obj ) {
    return slice.call(obj, 0, obj.length);
}
var core_notice_data_SLKey = '_N';
var core_notice_data = steel[ core_notice_data_SLKey ] = steel[ core_notice_data_SLKey ] || {};
/*
 * 对缓存的检索
 * @method core_notice_find
 */
function core_notice_find( type ) {
	return core_notice_data[ type ] || ( core_notice_data[ type ] = [] );
}
/*
 * 添加事件
 * @method core_notice_on
 * @param {string} type
 * @param {Function} fn
 */
function core_notice_on( type, fn ) {
	core_notice_find( type ).unshift( fn );
}
/*
 * 移除事件
 * @method core_notice_off
 * @param {string} type
 * @param {Function} fn
 */
function core_notice_off( type, fn ) {
	var typeArray = core_notice_find( type ),
		index,
		spliceLength;
	if ( fn ) {
		if ( ( index = core_array_indexOf( fn, typeArray ) ) > -1 ) {
			spliceLength = 1;
		}
	} else {
		index = 0;
		spliceLength = typeArray.length;
	}
	spliceLength && typeArray.splice( index, spliceLength );
}
/*
 * 事件触发
 * @method core_notice_trigger
 * @param {string} type
 */
function core_notice_trigger( type ) {
	var typeArray = core_notice_find( type );
	var args = core_array_makeArray(arguments);
	args = args.slice(1, args.length);
	for ( var i = typeArray.length - 1; i > -1; i-- ) {
		typeArray[ i ] && typeArray[ i ].apply( undefined, args );
	}
}
/**
 * is Number
 */
function core_object_isNumber(value) {
    return core_object_typeof(value) === 'number';
}/**
 * is Object
 */
function core_object_isObject(value) {
    return core_object_typeof(value) === 'object';
}
function core_crossDomainCheck(url) {
    var urlPreReg = /^[^:]+:\/\/[^\/]+\//;
    var locationMatch = location.href.match(urlPreReg);
    var urlMatch = url.match(urlPreReg);
    return (locationMatch && locationMatch[0]) === (urlMatch && urlMatch[0]);
}
/**
 * arguments 简单多态 要求参数顺序固定
 * @param  {Arguments} args  参数对象
 * @param  {array} keys  参数名数组
 * @param  {array} types 类型数组 array/object/number/string/function
 * @return {object}      使用参数key组成的对象
 * @example
 * function test(a, b, c, d, e) {
 *    console.log(core_argsPolymorphism(arguments, ['a', 'b', 'c', 'd', 'e'], ['number', 'string', 'function', 'array', 'object']));
 * }
 * test(45, 'a', [1,3], {xxx:343}) => Object {a: 45, b: "a", d: Array[2], e: Object}
 */
function core_argsPolymorphism(args, keys, types) {
    var result = {};
    var newArgs = [];
    var typeIndex = 0;
    var typeLength = types.length;
    for (var i = 0, l = args.length; i < l; ++i) {
        var arg = args[i];
        if (arg === undefined || arg === null) {
            continue;
        }
        for (; typeIndex < typeLength; ++typeIndex) {
            if (core_object_typeof(arg) === types[typeIndex]) {
                result[keys[typeIndex]] = arg;
                ++typeIndex;
                break;
            }
        }
        if (typeIndex >= typeLength) {
            break;
        }
    }
    return result;
}
/**
 * 路由变量定义区
 *
 */
//收集用户路由配置信息
var router_base_routerTable = [];
//处理后的路由集合，[{pathRegexp:RegExp, controller:'controllerFn', keys:{}}]
var router_base_routerTableReg = [];
//应用是否支持单页面（跳转与否）
var router_base_singlePage = false;
// @Finrila hash模式处理不可用状态，先下掉
// //项目是否使用hash
// var router_base_useHash = false;
// init/new/forward/bak/refresh/replace
var router_base_routerType = 'init';
var router_base_prevHref;
var router_base_currentHref = location.toString();
/*
 * dom事件绑定
 * @method core_event_addEventListener
 * @private
 * @param {Element} el
 * @param {string} type
 * @param {string} fn
 */
var core_event_addEventListener = isAddEventListener ? 
	function( el, type, fn, useCapture) {
		el.addEventListener( type, fn, useCapture === undefined ? false : useCapture);
	}
	:
	function( el, type, fn ) {
		el.attachEvent( 'on' + type, fn );
	};
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
}/*
 * preventDefault
 * @method core_event_preventDefault
 * @private
 * @return {Event} e 
 */
function core_event_preventDefault( event ) {
	if ( event.preventDefault ) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}
function router_parseURL(url) {
    url = url || location.toString();
    var result = core_parseURL(url);
    // @Finrila hash模式处理不可用状态，先下掉
    // var hash = result.hash;
    // if (router_base_useHash && hash) {
    //     //获取当前 hash后的 path
    //     result = core_parseURL(core_fixUrl(url, hash));
    // }
    return result;
}
function router_match(url) {
    var routerUrl = core_object_isObject(url) ? url : router_parseURL(url);
    var path = routerUrl.path;// store values
    for (var i = 0, len = router_base_routerTableReg.length; i < len; i++) {
        var obj = router_base_routerTableReg[i];
        var pathMatchResult;//正则校验结果；
        if (pathMatchResult = obj['pathRegexp'].exec(path)) {
            var keys = obj['keys'];
            var param = {};
            var prop;
            var n = 0;
            var key;
            var val;
            for (var j = 1, len = pathMatchResult.length; j < len; ++j) {
                key = keys[j - 1];
                prop = key ? key.name : n++;
                val = decodeURIComponent(pathMatchResult[j]);
                param[prop] = val;
            }
            return {
                config: obj['config'],
                param: param
            };
        }
    }
}
/**
 * 地址管理，负责管理state的数据和当面页面在state历史中的索引位置
 */
// 当前页面在整个单页面跳转中的索引位置
var router_history_stateIndex_key = '--steel-stateIndex';
var router_history_state_data;
var router_history_state_dataForPush;
router_history_state_init();
core_notice_on('popstate', router_history_state_init);
//history pushState 及一些处理
function router_history_pushState(url) {
    router_history_state_setPush(router_history_stateIndex_key, router_history_getStateIndex() + 1);
    history.pushState(router_history_stateForPush(), undefined, url);
    router_history_state_init();
}
//history repaceState 及一些处理
function router_history_replaceState(url) {
    history.replaceState(router_history_state_data, undefined, url);
}
//获取当前页面在整个单页面跳转中的索引位置
function router_history_getStateIndex() {
    return router_history_state_get(router_history_stateIndex_key, 0);
}
//初始化state数据
function router_history_state_init() {
    router_history_state_dataForPush = {};
    router_history_state_data = router_history_state();
}
//获取当前的state
function router_history_state() {
    return history.state || {};
}
//获取下一个将要push页面的state数据
function router_history_stateForPush() {
    return router_history_state_dataForPush;
}
//获取当前state上的某值
function router_history_state_get(key, defaultValue) {
    router_history_state_data = router_history_state();
    if (key in router_history_state_data) {
        return router_history_state_data[key];
    } else if (defaultValue !== undefined) {
        router_history_state_set(key, defaultValue);
        return defaultValue;
    }
}
//设置值到缓存中，并更改history.state的值
function router_history_state_set(key, value) {
    router_history_state_data = {};
    var state = history.state;
    if (state) {
        for (var state_key in state) {
            router_history_state_data[state_key] = state[state_key];
        }
    }
    core_object_extend(router_history_state_data, key, value);
    router_history_replaceState(location.href);
}
//向下一个state的缓存区域添加数据项 并返回新的数据
function router_history_state_setPush(key, value) {
    core_object_extend(router_history_state_dataForPush, key, value);
}/**
 * 公共对象方法定义文件
 */
//control容器
var render_base_controlCache = {};
//controllerNs容器
var render_base_controllerNs = {};
//资源容器
var render_base_resContainer = {};
//渲染相关通知事件的前缀
var render_base_notice_prefix = '-steel-render-';
//sessionStorage级别 是否使用state缓存模块的数据内容
var render_base_dataCache_usable = false;
//场景相关配置
//场景最大个数
var render_base_stage_maxLength = 10;
//是否启用场景管理
var render_base_stage_usable = false;
//内存级：是否在浏览器中内存缓存启用了场景的页面内容，缓存后页面将由开发者主动刷新
var render_base_stageCache_usable = false;
//是否支持场景切换
var render_base_stageChange_usable = false;
//场景默认显示内容
var render_base_stageDefaultHTML = '';
////
//是否添加模块父样式
var render_base_useCssPrefix_usable = false;
//是否启用进度条
var render_base_loadingBar_usable = false;
//boxid生成器 当参数为true时要求：1.必须唯一 2.同一页面同一模块的id必须是固定的
function render_base_idMaker(supId) {
    return core_uniqueKey();
}
function render_error() {
    var args = core_array_makeArray(arguments);
    core_notice_trigger.apply(undefined, ['renderError'].concat(args));
}/*
 * control核心逻辑
 *//*
 * 给节点设置属性
 * @method core_dom_getAttribute
 * @private
 * @param {string} name
 */
function core_dom_getAttribute( el, name ) {
    return el.getAttribute( name );
}
/*
 * 对象克隆
 * @method core_object_clone
 */
function core_object_clone( obj ) {
	var ret = obj;
	if ( core_object_typeof( obj ) === 'array' ) {
		ret = [];
		var i = obj.length;
		while ( i-- ) {
			ret[ i ] = core_object_clone( obj[ i ] );
		}
	} else if ( core_object_typeof( obj ) === 'object' ) {
		ret = {};
		for ( var k in obj ) {
			ret[ k ] = core_object_clone( obj[ k ] );
		}
	}
	return ret;
}
/*
 * 返回指定ID或者DOM的节点句柄
 * @method core_dom_removeNode
 * @private
 * @param {Element} node 节点对象
 * @example
 * core_dom_removeNode( node );
 */
function core_dom_removeNode( node ) {
	node && node.parentNode && node.parentNode.removeChild( node );
}
/**
 * 模块渲染和运行时的错误触发
 * @param  {object} resContainer 资源容器
 * @param  {string} type         错误类型
 * @param  {any} ...         错误信息
 * @return {undefined}          
 */
function render_control_triggerError(resContainer, type) {
    var args = core_array_makeArray(arguments).slice(1);
    log.apply(undefined, ['Error: render'].concat(args));
    core_notice_trigger.apply(undefined, [resContainer.boxId + 'error'].concat(args))
}
function render_control_setLogic(resContainer) {
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var logic = resContainer.logic;
    var startTime = null;
    var endTime = null;
    var logicCallbackFn;
    resContainer.logicReady = false;
    resContainer.logicFn = null;
    resContainer.logicRunned = false;
    if(logic){
        if(core_object_typeof(logic) === 'function'){
            resContainer.logicFn = logic;
            render_control_toStartLogic(resContainer);
        } else {
            var cb = logicCallbackFn = function(fn) {
                if(cb === logicCallbackFn){
                    endTime = now();
                    core_notice_trigger('logicTime', {
                        startTime: startTime,
                        logicTime: endTime - startTime || 0,
                        ctrlNS: controllerNs
                    });
                    fn && (resContainer.logicFn = fn);
                    render_control_toStartLogic(resContainer);
                }
                //抛出js加载完成事件
            };
            startTime = now();
            require_global(logic, cb, function() {
                render_error();
                render_control_triggerError(resContainer, 'logic', logic);
            }, controllerNs);
        }
    }
}
function render_control_toStartLogic(resContainer) {
    resContainer.logicReady = true;
    render_control_startLogic(resContainer);
}
function render_control_startLogic(resContainer) {
    var boxId = resContainer.boxId;
    var box = getElementById(boxId);
    var control = render_base_controlCache[boxId];
    var logicResult;
    var real_data = resContainer.real_data || {};
    if (!resContainer.logicRunned && resContainer.logicFn && resContainer.logicReady && resContainer.rendered) {
        if (isDebug) {
            logicResult = resContainer.logicFn(box, real_data, control) || {};
        } else {
            try {
                logicResult = resContainer.logicFn(box, real_data, control) || {};
            } catch(e) {
                render_control_triggerError(resContainer, 'runLogic', resContainer.logic, e);
            }
        }
        resContainer.logicResult = logicResult;
        resContainer.logicRunned = true;
    }
}
/*
 * 销毁logic
*/
function render_control_destroyLogic(resContainer) {
    resContainer.logicRunned = false;
    var logicResult = resContainer.logicResult;
    if (logicResult) {
        if (isDebug) {
            logicResult.destroy && logicResult.destroy();
        } else {
            try {
                logicResult.destroy && logicResult.destroy();
            } catch(e) {
                log('Error: destroy logic error:', resContainer.logic, e);
            }
        }
      resContainer.logicResult = undefined;
    }
}/**
 * @param {Object} o
 * @param {boolean} isprototype 继承的属性是否也在检查之列
 * @example
 * core_object_isEmpty({}) === true;
 * core_object_isEmpty({'test':'test'}) === false;
 */
function core_object_isEmpty(o,isprototype){
    for(var k in o){
        if(isprototype || o.hasOwnProperty(k)){
            return false;
        }
    }
    return true;
}
function core_array_inArray(oElement, aSource){
    return core_array_indexOf(oElement, aSource) > -1;
}/**
 * 场景管理
 * 第一版本实现目标：
 *//*
 * 创建节点
 * @method core_dom_createElement
 * @private
 * @param {string} tagName
 */
function core_dom_createElement( tagName ) {
	return document.createElement( tagName );
}
/*
 * 给节点设置属性
 * @method core_dom_setAttribute
 * @private
 * @param {string} name
 * @param {string} value
 */
function core_dom_setAttribute( el, name, value ) {
	return el.setAttribute( name, value );
}/**
 * 销毁一个模块，样式，逻辑，节点
 *//**
 * s-data属性的特殊处理，当子模块节点中s-data的值为#sdata-开头时 从缓存中获取模块数据
 */
var render_control_sData_preFix = '#sdata-';
var render_control_sData_current_boxId;
var render_control_sData_s_data_index;
var render_control_sData_dataMap = {};
function render_control_sData(data) {
    var dataId = render_control_sData_preFix + render_control_sData_current_boxId + '-' + (render_control_sData_s_data_index++);
    render_control_sData_dataMap[render_control_sData_current_boxId][dataId] = data || {};
    return dataId;
}
function render_control_sData_setBoxId(boxId) {
    render_control_sData_current_boxId = boxId;
    render_control_sData_s_data_index = 0;
    render_control_sData_dataMap[boxId] = {};
}
function render_control_sData_getData(dataId) {
    var idMatch = dataId.match(RegExp('^' + render_control_sData_preFix + '(.*)-\\d+$'));
    if (idMatch) {
        return render_control_sData_dataMap[idMatch[1]][dataId];
    }
}
function render_control_sData_delData(boxId) {
    delete render_control_sData_dataMap[boxId];
}
function render_control_destroy(idMap, onlyRes) {
  idMap = idMap || {};
  if (typeof idMap === 'string') {
    var _idMap = {};
    _idMap[idMap] = true;
    idMap = _idMap;
  }
  for (var id in idMap) {
    render_control_destroy_one(id, onlyRes);
  }
}
function render_control_destroy_one(id, onlyRes) {
  var resContainer = render_base_resContainer[id];
  var childControl = render_base_controlCache[id];
  var childControllerNs = render_base_controllerNs[id];
  if (!onlyRes) {
    if (childControl) {
      childControl._destroy();
      delete render_base_controlCache[id];
    }
    if (childControllerNs) {
      delete render_base_controllerNs[id];
    }
  }
  if (resContainer) {
    render_control_destroyLogic(resContainer);
    render_control_setCss_destroyCss(resContainer);
    render_control_destroy(resContainer.childrenid);
    render_control_sData_delData(id);
    delete render_base_resContainer[id];
  }
}/**
 * 得到节点的计算样式
 */
var core_dom_getComputedStyle = window.getComputedStyle ? function(node, property) {
    return getComputedStyle(node, '')[property];
} : function(node, property) {
    return node.currentStyle && node.currentStyle[property];
};/**
 * querySelectorAll
 * 在非h5下目前只支持标签名和属性选择如div[id=fsd],属性值不支持通配符
 */
var core_dom_querySelectorAll_REG1 = /([^\[]*)(?:\[([^\]=]*)=?['"]?([^\]]*?)['"]?\])?/;
function core_dom_querySelectorAll(dom, select) {
	var result;
	var matchResult;
	var matchTag;
	var matchAttrName;
	var matchAttrValue;
	var elements;
	var elementAttrValue;
	if (dom.querySelectorAll) {
		result = dom.querySelectorAll(select);
	} else {
		if (matchResult = select.match(core_dom_querySelectorAll_REG1)) {
			matchTag = matchResult[1];
			matchAttrName = matchResult[2];
			matchAttrValue = matchResult[3];
			result = getElementsByTagName(matchTag || '*', dom);
			if (matchAttrName) {
				elements = result;
				result = [];
				for (var i = 0, l = elements.length; i < l; ++i) {
					elementAttrValue = elements[i].getAttribute(matchAttrName);
					if (elementAttrValue !== null && (!matchAttrValue || elementAttrValue === matchAttrValue)) {
						result.push(elements[i])
					}
				}
			}
		}
	}
	return result || [];
}/*
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
	};/**
 * event对象属性适配
 */
function core_event_eventFix(e) {
    e.target = e.target || e.srcElement;
}/**
 * 两点之间的距离
 */
function core_math_distance(point1, point2) {
    return Math.sqrt(Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2));
}
var core_dom_className_blankReg = / +/g;
/**
 * classname编辑工具
 */
function core_dom_className(node, addNames, delNames) {
    var oldClassName = ' ' + (node.className || '').replace(core_dom_className_blankReg, '  ') + ' ';
    addNames = addNames || '';
    delNames = (addNames + ' ' +(delNames || '')).replace(core_dom_className_blankReg, '|').replace(/^\||\|$/, '');
    node.className = oldClassName.replace(RegExp(' (' + delNames + ') ', 'ig'), ' ') + ' ' + addNames;
}
var render_stage_data = {}; //stageBoxId -> {curr:index, last:index, subs:[]}
var render_stage_anidata = {};
var render_stage_style_mainId = 'steel-style-main';
var render_stage_style_rewriteId = 'steel-style-rewrite';
var render_stage_ani_transition_class = 'steel-stage-transform';
var render_stage_scroll_class = 'steel-render-stage-scroll';
var render_stage_fixed_class = 'steel-render-stage-fixed';
var render_stage_subNode_class = 'steel-stage-sub';
//状态变量区域
var render_stage_webkitTransitionDestroyFn;
var render_stage_ani_doing;
var render_stage_input_focused;
var render_stage_boxId;
var render_stage_touch_status_started;
var render_stage_touch_status_start_time;
var render_stage_touch_status_moved;
var render_stage_touch_status_move_time;
var render_stage_touch_status_ended;
var render_stage_touch_status_end_time;
////
var inputReg = /input|textarea/i;
/**
 * 获取当前渲染的stageBoxId
 */
function render_stage_getBox() {
    return getElementById(render_stage_boxId || mainBox && mainBox.id);
}
/**
 * 获取当前支持滚动的节点的id  这个方法只在启用了并支持场景切换功能时有效，
 */
function render_stage_getScrollBox() {
    var boxId = render_stage_boxId || mainBox && mainBox.id;
    var stageScrollId;
    if (render_base_stageChange_usable) {
        stageScrollId = render_base_resContainer[boxId] && render_base_resContainer[boxId].stageScrollId;
        if (stageScrollId) {
            return getElementById(stageScrollId);
        }
    }
}
function render_stage_init() {
    render_stage_style_init();
    render_stage_change_init();
}
//场景切换功能初始化
function render_stage_change_init() {
    if (!render_base_stageChange_usable) {
        return;
    }
    var touchDataStartX, touchDataStartY, touchDataLastX, touchDataLastY, touchDataX, touchDataY;
    // var touchDirection, touchMoved;
    // var touchStartTime;
    // var isPreventDefaulted;
    var isInputTouched;
    var lastTouchendTime;
    core_event_addEventListener(docElem, 'touchstart', function(e) {
        core_event_eventFix(e);
        checkStopEvent(e);
        render_stage_touch_status_started = true;
        render_stage_touch_status_moved = false;
        render_stage_touch_status_start_time = now();
        render_stage_touch_status_ended = undefined;
        render_stage_touch_status_end_time = undefined;
        if (render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        readTouchData(e);
        touchDataStartX = touchDataX;
        touchDataStartY = touchDataY;
        // touchStartTime = now();
        // 针对iphone下文本框输入时样式错乱问题的方法解决
        if (iphone) {
            isInputTouched = inputReg.test(e.target.tagName);
            if (!isInputTouched) {
                render_stage_input_focused = false;
                render_stage_style_rewrite();
            }
        }
    });
    // core_event_addEventListener(docElem, 'touchmove', function(e) {
    //     if (e._7) {
    //         return;
    //     }
    //     e._7 = true;
    //     var oldPreventDefault = e.preventDefault;
    //     isPreventDefaulted = false;
    //     e.preventDefault = function() {
    //         isPreventDefaulted = true;
    //         oldPreventDefault.call(e);
    //     };
    // }, true);
    var count = 0;
    core_event_addEventListener(docElem, 'touchmove', function(e) {
        readTouchData(e);
        render_stage_touch_status_moved = true;
        // if (core_math_distance([touchDataX, touchDataY], [touchDataLastX, touchDataLastY]) > 15) {
        //     render_stage_touch_status_moved = true;
        // }
        render_stage_touch_status_move_time = now();
        if (render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        // if (!touchDirection) {
        //     touchDirection = (Math.abs(touchDataY - touchDataLastY) > Math.abs(touchDataX - touchDataLastX)) ? 'Y' : 'X';
        // }
        // touchMoved = true;
        // if (isPreventDefaulted) {
        //     return;
        // }
        // if (touchDirection === 'X') {
        //     // e.preventDefault();
        // } else {
        // }
    });
    core_event_addEventListener(docElem, 'touchend', function(e) {
        core_event_eventFix(e);
        checkStopEvent(e);
        //阻止dblclick的默认行为
        if (lastTouchendTime && now() - lastTouchendTime < 300 || render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        render_stage_touch_status_ended = true;
        render_stage_touch_status_end_time = lastTouchendTime = now();
        // readTouchData(e);
        // touchDirection = touchMoved = undefined;
        // 针对iphone下文本框输入时样式错乱问题的方法解决
        if (iphone) {
            if (isInputTouched && inputReg.test(e.target.tagName)) {
                render_stage_input_focused = true;
                render_stage_style_rewrite();
            }
        }
    });
    //动画期间阻止一切事件的触发
    core_event_addEventListener(docElem, 'click', checkStopEvent);
    function readTouchData(e) {
        var touch = e.changedTouches[0];
        touchDataLastX = touchDataX;
        touchDataLastY = touchDataY;
        touchDataX = touch.clientX;
        touchDataY = touch.clientY;
    }
    //动画期间阻止一切事件的触发
    function checkStopEvent(e) {
        if (render_stage_ani_doing) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
function render_stage_change_check_host_behaviour_onStageChangeBack() {
    if (iphone && render_stage_touch_status_started && render_stage_touch_status_moved) {
        if (!render_stage_touch_status_ended) {
            return true;
        } else if (now() - render_stage_touch_status_end_time < 377) {
            return true;
        }
    }
}
/**
 * 根据路由类型在维护当前场景并返回当前路由与该场景对应的渲染节点
 * @param  {string} stageBoxId  场景主节点
 * @param  {string} routerType init/new/forward/bak/refresh/replace
 */
function render_stage(stageBoxId, routerType) {
    var stateIndex = router_history_getStateIndex();
    var data = render_stage_data_get(stageBoxId, stateIndex);
    var node = getElementById(stageBoxId);
    core_dom_setAttribute(node, 's-stage-sup', 'true');
    if (!data.subs[stateIndex]) {
        render_stage_data_newsub(node, data, stateIndex);
    }
    var subData = data.subs[stateIndex];
    data.last = data.curr;
    data.curr = stateIndex;
    return (render_stage_boxId = subData.id);
}
function render_stage_ani(stageBoxId, aniType, aniEnd) {
    render_stage_ani_doing = true;
    var node = getElementById(stageBoxId);
    var data = render_stage_data_get(stageBoxId);
    var subs = data.subs;
    var last = data.last;
    var curr = data.curr;
    var lastSub = subs[last];
    var currSub = subs[curr];
    var goForward = curr > last;
    var renderFromStage = false;
    var lastNode = getElementById(lastSub.id);
    var currNode = getElementById(currSub.id);
    if (lastSub !== currSub) {
        renderFromStage = currSub.inStage && render_base_stageCache_usable;
        //在iphone下判断web宿主容器的行为，如果发现是宿主切换的页面就不做动画，原因是宿主的行为不能被阻止，
        var is_host_behaviour = curr < last && render_stage_change_check_host_behaviour_onStageChangeBack();
        // window._setTitle && _setTitle(is_host_behaviour ? '1111' : '000000');
        if (render_base_stageChange_usable && !is_host_behaviour) {
            var winWidth = docElem.clientWidth;
            var winHeight = docElem.clientHeight;
            var bodyBackgroundColor = core_dom_getComputedStyle(document.body, 'backgroundColor');
            render_stage_webkitTransitionDestroyFn && render_stage_webkitTransitionDestroyFn();
            var currLeft = (goForward ? winWidth : -winWidth/3);
            currNode.style.top = 0;
            currNode.style.left = currLeft + 'px';
            if (goForward) {
                lastNode.style.zIndex = 99;
                currNode.style.zIndex = 100;
                currNode.style.boxShadow = '0 0 20px 0 rgba(0,0,0,0.40)';
                currNode.style.backgroundColor = bodyBackgroundColor;
            } else {
                currNode.style.zIndex = 99;
                lastNode.style.zIndex = 100;
                lastNode.style.boxShadow = '0 0 20px 0 rgba(0,0,0,0.40)';
                lastNode.style.backgroundColor = bodyBackgroundColor;
            }
            currNode.style.display = '';
            render_stage_input_focused = false;
            render_stage_webkitTransitionDestroyFn = node_webkitTransitionDestroy;
            render_stage_style_rewrite();
            setTimeout(function() {
                currNode.style.WebkitTransform = 'translate3d(' + (-currLeft) + 'px, 0, 0)';
                lastNode.style.WebkitTransform = 'translate3d(' + (goForward ? -winWidth/3 : winWidth) + 'px, 0, 0)';
                core_dom_className(currNode, render_stage_ani_transition_class);
                core_dom_className(lastNode, render_stage_ani_transition_class);
                core_event_addEventListener(node, 'webkitTransitionEnd', node_webkitTransitionEnd);
            }, 199);
            function node_webkitTransitionEnd(e) {
                var target = (e.target || e.srcElement);
                if (target !== currNode && target !== lastNode) {
                    return;
                }
                node_webkitTransitionDestroy();
            }
            function node_webkitTransitionDestroy() {
                if (!render_stage_webkitTransitionDestroyFn) {
                    return;
                }
                render_stage_webkitTransitionDestroyFn = false;
                core_event_removeEventListener(node, 'webkitTransitionEnd', node_webkitTransitionEnd);
                core_dom_className(currNode, undefined, render_stage_ani_transition_class);
                core_dom_className(lastNode, undefined, render_stage_ani_transition_class);
                currNode.style.cssText = '';
                lastNode.style.cssText = 'display:none';
                render_stage_style_rewrite();
                doDestroy();
                callAniEnd();
            }
        } else {
            if (render_base_stageChange_usable && is_host_behaviour) {
                lastNode.style.display = 'none';
                currNode.style.display = '';
                doDestroy();
                callAniEnd();
            } else {//当不是系统切换页面行为时使用等待的方式解决透传问题
                setTimeout(function() {
                    lastNode.style.display = 'none';
                    currNode.style.display = '';
                    doDestroy();
                    callAniEnd();
                }, 366);
            }
        }
    } else {
        currNode.style.display = '';
        callAniEnd();
    }
    if (currSub) {
        currSub.inStage = true;
    }
    return renderFromStage;
    function doDestroy() {
        var index = router_history_getStateIndex();
        render_stage_destroy(data, index + 1);
        if (!render_base_stageCache_usable) {
            render_stage_destroy(data, 0, index - 1);
        }
    }
    function callAniEnd() {
        if (aniEnd) {
            aniEnd(currSub.id, lastSub.id, renderFromStage);
        }
        render_stage_touch_status_started = false;
        setTimeout(function() {
            render_stage_ani_doing = false;
        }, 377);
    }
}
/**
 * 销毁场景下无用的子
 */
function render_stage_destroy(data, fromIndex, toIndex) {
    var subs = data.subs;
    var destroySubs = [];
    toIndex = toIndex === undefined ? (subs.length - 1) : toIndex;
    for (var i = fromIndex; i <= toIndex; ++i) {
        destroySubs.push(subs[i]);
        subs[i] = undefined;
    }
    setTimeout(function() {
        for (var i = 0, l = destroySubs.length; i < l; ++i) {
            if (destroySubs[i]) {
                var subId = destroySubs[i].id;
                !function(subId) {
                    setTimeout(function() {
                        try{
                            render_control_destroy(subId);
                        } catch(e) {
                            log('Error: destroy subId(' + subId + ') error in stage!');
                        } finally {
                            core_dom_removeNode(getElementById(subId));
                        }
                    });
                }(subId);
            }
        }
    }, 377);
}
/**
 * 新建子数据和节点 step 步数
 */
function render_stage_data_newsub(node, data, stateIndex) {
    var subId = render_base_idMaker();
    var subNode = core_dom_createElement('div');
    subNode.id = subId;
    core_dom_className(subNode, render_stage_subNode_class);
    core_dom_setAttribute(subNode, 's-stage-sub', 'true');
    subNode.innHTML = render_base_stageDefaultHTML;
    subNode.style.display = 'none';
    node.appendChild(subNode);
    var subs = data.subs;
    subs[stateIndex] = {
        id: subId
    };
    if (stateIndex >= render_base_stage_maxLength) {
        render_stage_destroy(data, 0, stateIndex - render_base_stage_maxLength + 1);
        return true;
    }
}
/**
 * 产生并获取数据结构
 */
function render_stage_data_get(stageBoxId, stateIndex) {
    if (!render_stage_data[stageBoxId]) {
        render_stage_data[stageBoxId] = {
            last: stateIndex,
            curr: stateIndex,
            subs: []
        };
    }
    return render_stage_data[stageBoxId];
}
//fixed元素处理 解决动画时和动画后fixed节点抖动的问题
function render_stage_style_init() {
    if (!render_base_stage_usable) {
        return;
    }
    var styleTextArray = [];
    if (render_base_stageChange_usable) {
        styleTextArray.push('body{overflow:hidden;-webkit-overflow-scrolling : touch;}');//
        styleTextArray.push('.' + render_stage_ani_transition_class + '{-webkit-transition: -webkit-transform 0.4s ease-out;transition: transform 0.4s ease-out;}');
        styleTextArray.push('.' + render_stage_subNode_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;}');
        styleTextArray.push('.' + render_stage_scroll_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;-webkit-box-sizing : border-box;}');
    }
    styleTextArray.push('.' + render_stage_fixed_class + '{position:fixed!important;}');
    var styleEl = core_dom_createElement('style');
    core_dom_setAttribute(styleEl, 'type', 'text/css');
    styleEl.id = render_stage_style_mainId;
    styleEl.innerHTML = styleTextArray.join('');
    head.appendChild(styleEl);
}
/**
 * Steel自带样式重写方法，当处于动画中时fixed节点使用abosolute，当input得到焦点时scroll节点删除overflow-y：auto，解决input聚焦时业务样式丢失的问题
 */
function render_stage_style_rewrite() {
    var styleTextArray = [];
    if (render_stage_webkitTransitionDestroyFn) {
        styleTextArray.push('.' + render_stage_fixed_class + '{position:absolute!important;}');
    }
    if (render_stage_input_focused) {
        styleTextArray.push('.' + render_stage_scroll_class + '{overflow-y: visible!important;}');
    }
    var styleEl = getElementById(render_stage_style_rewriteId);
    if (!styleEl) {
        styleEl = core_dom_createElement('style');
        core_dom_setAttribute(styleEl, 'type', 'text/css');
        styleEl.id = render_stage_style_rewriteId;
        styleEl.innerHTML = styleTextArray.join('');
        head.appendChild(styleEl);
    } else {
        styleEl.innerHTML = styleTextArray.join('');
    }
}
//解析jade fun
function render_parse(jadeFunStr) {
    var g;
    var result = [];
    var ret = [];
    var reg = /<[a-z]+([^>]*?s-(child)[^>]*?)>/g;//|tpl|data|css|logic
    while (g = reg.exec(jadeFunStr)) {
        var ele = g[1].replace(/\\\"/g, '"');
        var oEle = ele.replace(/\"/g, '').replace(/ /g, '&');
        var eleObj = core_queryToJson(oEle);
        var id = render_base_idMaker();
        eleObj['s-id'] = id;
        eleObj['s-all'] = ele;
        result.push(eleObj);
    }
    reg = RegExp('(class=\"[^\]*?' + render_stage_scroll_class + '[^\]*?\")');
    if (g = reg.exec(jadeFunStr)) {
        result.push({
            's-stage-scroll': true,
            's-all': g[1].replace(/\\\"/g, '"'),
            's-id': render_base_idMaker()
        });
    }
    return result;
}/*
 * 处理子模块
*/
function render_control_handleChild(boxId, tplParseResult) {
    var resContainer = render_base_resContainer[boxId];
    var s_controller, s_child, s_id;
    var parseResultEle;
    var childResContainer = {};
    for (var i = 0, len = tplParseResult.length; i < len; i++) {
        parseResultEle = tplParseResult[i];
        if (parseResultEle['s-stage-scroll']) {
            continue;
        }
        s_id = parseResultEle['s-id'];
        childResContainer = render_base_resContainer[s_id] = render_base_resContainer[s_id] || {
            boxId: s_id,
            childrenid: {},
            s_childMap: {},
            needToTriggerChildren: false,
            toDestroyChildrenid: null,
            forceRender: false,
            lastRes:{},
            fromParent: true
        };
        resContainer.childrenid[s_id] = true;
        childResContainer.parentId = boxId;
        childResContainer.tpl = parseResultEle['s-tpl'];
        childResContainer.css = parseResultEle['s-css'];
        childResContainer.data = parseResultEle['s-data'];
        childResContainer.logic = parseResultEle['s-logic'];
        if(s_child = parseResultEle['s-child']) {
            s_child = (s_child === 's-child' ? '' : s_child);
            if(s_child) {
                s_controller = resContainer.children && resContainer.children[s_child];
                resContainer.s_childMap[s_child] = s_id;
            } else {
                s_controller = parseResultEle['s-controller']
            }
            render_run(s_id, s_controller);//渲染提前
        }
    }
}
//用户扩展类
function render_control_setExtTplData_F() {}
render_control_setExtTplData_F.prototype.constructor = render_control_setExtTplData_F;
//用于帮助用户设置子模块数据的方法：steel_s_data(data) data为要设置的对象，设置后
render_control_setExtTplData_F.prototype.steel_s_data = render_control_sData;
//用户扩展全局功能方法
function render_control_setExtTplData(obj) {
    if (!core_object_isObject(obj)) {
        log('Error:The method "steel.setExtTplData(obj)" used in your app need an object as the param.');
        return;
    }
    render_control_setExtTplData_F.prototype = obj;
}
/**
 * 触发rendered事件
 */
function render_control_triggerRendered(boxId) {
    core_notice_trigger('rendered', {
        boxId: boxId,
        controller: render_base_controllerNs[boxId]
    });
}
var render_control_render_moduleAttrName = 's-module';
var render_control_render_moduleAttrValue = 'ismodule';
function render_control_render(resContainer) {
    //如果是react组件，执行react_render逻辑
    if(resContainer.component){
        log("render_control_component_render",resContainer);
        render_control_component_render(resContainer);
        return;
    }
    var boxId = resContainer.boxId;
    if ( !resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
        return;
    }
    var tplFn = resContainer.tplFn;
    var real_data = resContainer.real_data;
    if (!tplFn || !real_data) {
        return;
    }
    var html = resContainer.html;
    if (!html) {
        render_control_sData_setBoxId(boxId);
        var parseResultEle = null;
        var extTplData = new render_control_setExtTplData_F();
        var retData = extTplData;
        for (var key in real_data) {
            retData[key] = real_data[key];
        }
        try {
            html = tplFn(retData);
        } catch (e) {
            render_error(e);
            render_control_triggerError(resContainer, 'render', e);
            return;
        }
        resContainer.html = html;
    }
    if (!resContainer.cssReady) {
        return;
    }
    //子模块分析
    resContainer.childrenid = {};
    var tplParseResult = render_parse(html);
    resContainer.stageScrollId = undefined;
    //去掉节点上的资源信息
    for (var i = 0, len = tplParseResult.length; i < len; i++) {
        parseResultEle = tplParseResult[i];
        if (parseResultEle['s-stage-scroll']) {
            resContainer.stageScrollId = parseResultEle['s-id'];
            html = html.replace(parseResultEle['s-all'], parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        } else {
            html = html.replace(parseResultEle['s-all'], ' ' + render_control_render_moduleAttrName + '=' + render_control_render_moduleAttrValue + ' ' + parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        }
    }
    resContainer.html = html;
    ////@finrila 由于做场景管理时需要BOX是存在的，所以调整渲染子模块流程到写入HTML后再处理子模块，那么每个模块的box在页面上是一定存在的了
    var box = getElementById(boxId);
    render_control_destroyLogic(resContainer);
    render_control_destroy(resContainer.toDestroyChildrenid, false);
    box.innerHTML = html;
    resContainer.rendered = true;
    render_control_startLogic(resContainer);
    render_control_handleChild(boxId, tplParseResult);
    render_control_setCss_destroyCss(resContainer, true);
    render_control_triggerRendered(boxId);
}
function render_control_component_render(resContainer) {
    if(!resContainer.componentReady || !resContainer.cssReady || resContainer.rendered){
        return;
    }
    var boxId = resContainer.boxId;
    var real_data = resContainer.real_data;
    var virtualDom = resContainer.virtualDom;
    if (!virtualDom) {
        try {
            resContainer.virtualDom = ReactDOM.render(
                React.createElement(resContainer.component, {data:real_data}, null),
                document.getElementById(boxId)
            );
        } catch (e) {
            render_error(e);
            render_control_triggerError(resContainer, 'render', e);
            return;
        }
    }
    resContainer.rendered = true;
    render_control_setCss_destroyCss(resContainer, true);
    render_control_triggerRendered(boxId);
}
/**
 * 获取 url 的目录地址
 */
function core_urlFolder(url){
    return url.substr(0, url.lastIndexOf('/') + 1);
}
/**
 * 命名空间的适应
 */
function core_nameSpaceFix(id, basePath) {
    basePath = basePath && core_urlFolder(basePath);
    if (id) {
        if (id.indexOf('.') === 0) {
            id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
        }
        while (id.indexOf('../') !== -1) {
            id = id.replace(/\w+\/\.\.\//, '');
        }
    }
    return id;
}
var render_control_setCss_cssCache = {};//css容器
var render_control_setCss_cssCallbackFn;
function render_control_setCss(resContainer) {
    var cssCallbackFn;
    var startTime = null;
    var endTime = null;
    var css = resContainer.css;
    if (!css) {
        cssReady();
        return;
    }
    var boxId = resContainer.boxId;
    var box;
    var cssId;
    var controllerNs = render_base_controllerNs[boxId];
    var css = core_nameSpaceFix(resContainer.css, controllerNs);
    //给模块添加css前缀
    if (render_base_useCssPrefix_usable && (box = getElementById(boxId)) && (cssId = resource_res_getCssId(css))) {
        core_dom_className(box, cssId);
    }
    if (render_control_setCss_cssCache[css]) {
        render_control_setCss_cssCache[css][boxId] = true;
        cssReady();
        return;
    }
    render_control_setCss_cssCache[css] = {};
    render_control_setCss_cssCache[css][boxId] = true;
    var cb = render_control_setCss_cssCallbackFn = function(){
        if(cb === render_control_setCss_cssCallbackFn) {
            endTime = now();
            core_notice_trigger('cssTime', {
                startTime: startTime,
                cssTime: (endTime - startTime) || 0,
                ctrlNS: controllerNs
            });
            cssReady();
            //抛出css加载完成事件
        }
    };
    startTime = now();
    resource_res.css(css, cb, function() {
        cssReady();
        render_control_triggerError(resContainer, 'css', css);
    });
    function cssReady() {
        resContainer.cssReady = true;
        render_control_render(resContainer);
    }
}
function render_control_setCss_destroyCss(resContainer, excludeSelf) {
    var boxId = resContainer.boxId;
    var controllerNs = render_base_controllerNs[boxId];
    var excludeCss = excludeSelf && core_nameSpaceFix(resContainer.css, controllerNs);
    for(var css in render_control_setCss_cssCache) {
        if (excludeCss === css) {
            continue;
        }
        var cssCache = render_control_setCss_cssCache[css];
        if (cssCache[boxId]) {
            delete cssCache[boxId];
            !function() {
                for (var _boxId in cssCache) {
                    return;
                }
                resource_res.removeCss(css);
                delete render_control_setCss_cssCache[css];
            }();
        }
    }
}
function render_control_setChildren(resContainer) {
    var children = resContainer.children || {};
    for (var key in children) {
        //如果存在，相应的key则运行
        if (resContainer.s_childMap[key]) {
            render_run(resContainer.s_childMap[key], children[key]);
        }
    }
}
function render_control_destroyChildren(childrenid) {
    render_control_destroy(childrenid);
}
function render_control_setTpl(resContainer) {
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var tplCallbackFn;
    var startTime = null;
    var endTime = null;
    var tpl = resContainer.tpl;
    resContainer.tplFn = null;
    if(tpl){
        if(core_object_typeof(tpl) === 'function'){
            resContainer.tplFn = tpl;
            render_control_setTpl_toRender(resContainer);
            return;
        }
        var cb = tplCallbackFn = function(jadefn){
            if(cb === tplCallbackFn){
                endTime = now();
                core_notice_trigger('tplTime', {
                    startTime: startTime,
                    tplTime: endTime - startTime || 0,
                    ctrlNS: controllerNs
                });
                resContainer.tplFn = jadefn;
                render_control_setTpl_toRender(resContainer);
            }
        };
        startTime = now();
        require_global(tpl, cb, function() {
            render_error();
            render_control_triggerError(resContainer, 'tpl', tpl);
        }, controllerNs);
    }
}
function render_control_setTpl_toRender(resContainer) {
    resContainer.tplReady = true;
    render_control_render(resContainer);
}//http://www.sharejs.com/codes/javascript/1985
function core_object_equals(x, y){
    // If both x and y are null or undefined and exactly the same
    if ( x === y ) {
        return true;
    }
    // If they are not strictly equal, they both need to be Objects
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
    }
    // They must have the exact same prototype chain, the closest we can do is
    // test the constructor.
    if ( x.constructor !== y.constructor ) {
        return false;
    }
    for ( var p in x ) {
        // Inherited properties were tested using x.constructor === y.constructor
        if ( x.hasOwnProperty( p ) ) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if ( ! y.hasOwnProperty( p ) ) {
                return false;
            }
            // If they have the same strict value or identity then they are equal
            if ( x[ p ] === y[ p ] ) {
                continue;
            }
            // Numbers, Strings, Functions, Booleans must be strictly equal
            if ( typeof( x[ p ] ) !== "object" ) {
                return false;
            }
            // Objects and Arrays must be tested recursively
            if ( ! core_object_equals( x[ p ],  y[ p ] ) ) {
                return false;
            }
        }
    }
    for ( p in y ) {
        // allows x[ p ] to be set to undefined
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
            return false;
        }
    }
    return true;
};
function render_contorl_toTiggerChildren(resContainer) {
    if (resContainer.needToTriggerChildren) {
        var s_childIdMap = {};
        if (resContainer.childrenChanged) {
            for (var s_child in resContainer.s_childMap) {
                s_childIdMap[resContainer.s_childMap[s_child]] = true;
            }
        }
        for (var id in resContainer.childrenid) {
            if (s_childIdMap[id]) {
                continue;
            }
            var childControl = render_base_controlCache[id];
            if (childControl) {
                render_run(id, childControl._controller);
            }
        }
    }
    resContainer.needToTriggerChildren = false;
}
var render_control_setData_dataCallbackFn;
function render_control_setData(resContainer, tplChanged) {
    var data = resContainer.data;
    // var isMain = getElementById(resContainer.boxId) === mainBox;
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var startTime = null;
    var endTime = null;
    var real_data;
    // var ajaxRunTime = 10;//计算ajax时间时，运行时间假定需要10ms（实际在10ms内）
    if (data === null || data === 'null') {
        render_control_setData_toRender({}, resContainer, tplChanged);
        return;
    }
    if (!data) {
        return;
    }
    var dataType = core_object_typeof(data);
    if (dataType === 'object') {
        render_control_setData_toRender(data, resContainer, tplChanged);
    } else if (dataType === 'string') {
        real_data = render_control_sData_getData(data);
        if (real_data) {
            render_control_setData_toRender(real_data, resContainer, tplChanged);
            return;
        }
        var cb = render_control_setData_dataCallbackFn = function(ret) {
            if (cb === render_control_setData_dataCallbackFn) {
                //拿到ajax数据
                endTime = now();
                core_notice_trigger('ajaxTime', {
                    startTime: startTime,
                    ajaxTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                render_control_setData_toRender(ret.data, resContainer, tplChanged);
            }
        };
        //开始拿模块数据
        startTime = now();
        resource_res.get(data, cb, function(ret){
            resContainer.real_data = null;
            render_error(ret);
            render_control_triggerError(resContainer, 'data', data, ret);
        });
    }
}
function render_control_setData_toRender(data, resContainer, tplChanged) {
    resContainer.dataReady = true;
    if (resContainer.forceRender || tplChanged || !core_object_equals(data, resContainer.real_data)) {
        resContainer.real_data = data;
        render_control_render(resContainer);
    } else {
        render_control_triggerRendered(resContainer.boxId);
        render_contorl_toTiggerChildren(resContainer);
    }
}
function render_control_setComponent(resContainer) {
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var componentCallbackFn;
    var startTime = null;
    var endTime = null;
    var component = resContainer.component;
    resContainer.componentReady = false;
    resContainer.componentFn = null;
    if(component){
        if(core_object_typeof(component) === 'function'){
            resContainer.componentFn = component;
            render_control_setComponent_toRender(resContainer);
            return;
        }
        var cb = componentCallbackFn = function(component){
            if(cb === componentCallbackFn){
                endTime = now();
                core_notice_trigger('componentTime', {
                    startTime: startTime,
                    componentTime: endTime - startTime || 0,
                    ctrlNS: controllerNs
                });
                resContainer.component = component;
                render_control_setComponent_toRender(resContainer);
            }
        };
        startTime = now();
        require_global(component, cb, function() {
            render_error();
            render_control_triggerError(resContainer, 'component', component);
        }, controllerNs);
    }
}
function render_control_setComponent_toRender(resContainer) {
    resContainer.componentReady = true;
    render_control_render(resContainer);
}
//检查资源是否改变
function render_control_checkResChanged(resContainer, type, value) {
    var valueType = core_object_typeof(value);
    var res = resContainer[type];
    var resFun = resContainer[type+ 'Fn'];
    if (resContainer.lastRes && type in resContainer.lastRes) {
        return resContainer.lastRes[type] !== value;
        // return render_control_checkResChanged(resContainer.lastRes, type, value);
    }
    if (type === 'data') {
        return true;
    }
    if (valueType === 'function') {
        return !resFun || resFun.toString() !== value.toString();
    }
    /*if (type === 'tpl' || type === 'logic') {
        return !(resContainer[type + 'Fn'] && resContainer[type + 'Fn'] === require_runner(value)[0]);
    }*/
    if (type === 'children') {
        return !core_object_equals(res, value);
    }
    return res !== value;
}
var render_control_main_types = ['css', 'tpl', 'data', 'logic', 'component'];
var render_control_main_realTypeMap = {
    tpl: 'tplFn',
    data: 'real_data',
    logic: 'logicFn',
    component: 'compositeFn'
};
var render_control_main_eventList = [
  'init',//模块初始化
  'enter',//模块从其他模块切换进入（不一定只发生在初始化时）
  'leave',//模块离开（不一定销毁）
  'error',//模块运行时错误，类型资源错误（data,tpl,css,logic）、渲染错误(render)、逻辑运行错误(run,runLogic)
  'destroy'//模块销毁事件
  ];
function render_control_main(boxId) {
    //资源容器
    var resContainer = render_base_resContainer[boxId] = render_base_resContainer[boxId] || {
        boxId: boxId,
        childrenid: {},
        s_childMap: {},
        needToTriggerChildren: false,
        toDestroyChildrenid: null,
        forceRender: false
    };
    var box = getElementById(boxId);
    var dealCalledByUser;
    //状态类型 newset|loading|ready
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned
    var changeResList = {};
    var control = {
        id: boxId,
        setForceRender: function(_forceRender) {
            resContainer.forceRender = _forceRender;
        },
        get: function(type) {
            return resContainer && resContainer[type];
        },
        set: function(type, value, toDeal) {
            if (!boxId) {
                return;
            }
            if (core_object_typeof(type) === 'object') {
                toDeal = value;
                for (var key in type) {
                    control.set(key, type[key]);
                }
                if (toDeal) {
                    deal();
                }
                return;
            }
            changeResList[type] = render_control_checkResChanged(resContainer, type, value);
            resContainer[type] = value;
            if (changeResList[type] && toDeal) {
                deal();
            }
        },
        /**
         * 控制器事件
         */
        on: function(type, fn) {
            if (render_control_main_eventList.indexOf(type) > -1) {
                core_notice_on(boxId + type, fn);
            }
        },
        off: function(type, fn) {
            if (render_control_main_eventList.indexOf(type) > -1 && fn) {
                core_notice_off(boxId + type, fn);
            }
        },
        refresh: function(forceRender) {
            resContainer.needToTriggerChildren = true;
            if (forceRender) {
                resContainer.real_data = undefined;
            }
            changeResList['data'] = true;
            deal();
        },
        /**
         * 资源处理接口,用户可以使用这个接口主动让框架去分析资源进行处理
         * @type {undefined}
         */
        deal: deal,
        _destroy: function() {
            for (var i = render_control_main_eventList.length - 1; i >= 0; i--) {
                core_notice_off(boxId + render_control_main_eventList[i]);
            }
            boxId = control._controller = resContainer = box = undefined;
        }
    };
    init();
    return control;
    function init() {
        resContainer.needToTriggerChildren = true;
        //状态
        resContainer.cssReady = true;
        resContainer.dataReady = true;
        resContainer.tplReady = true;
        resContainer.logicReady = true;
        resContainer.rendered = true;
        resContainer.logicRunned = false;
        //react 组件加载状态
        resContainer.componentReady = true;
        //第一层不能使用s-child与s-controller，只能通过render_run执行controller
        var type, attrValue;
        resContainer.lastRes = {};
        changeResList = {};
        for (var i = 0, l = render_control_main_types.length; i < l; ++i) {
            type = render_control_main_types[i];
            type !== 'data' && (resContainer.lastRes[type] = resContainer[type]);
            if (box) {
                attrValue = core_dom_getAttribute(box, 's-' + type);
                if (attrValue) {
                    if (render_control_checkResChanged(resContainer, type, attrValue)) {
                        changeResList[type] = true;
                        resContainer[type] = attrValue;
                    }
                } else {
                    if (type in resContainer) {
                        delete resContainer[type];
                    }
                }
            }
            if (resContainer.fromParent) {
                if (resContainer[type]) {
                    changeResList[type] = true;
                }
            }
        }
        resContainer.fromParent = false;
    }
    function deal(isSelfCall) {
        if (isSelfCall) {
            if (dealCalledByUser) {
                return;
            }
        } else {
            dealCalledByUser = true;
        }
        resContainer.lastRes = null;
        var tplChanged = changeResList['tpl'];
        var dataChanged = changeResList['data'];
        var cssChanged = changeResList['css'];
        var logicChanged = changeResList['logic'];
        var componentChanged = changeResList['component'];
        resContainer.childrenChanged = changeResList['children'];
        changeResList = {};
        if(componentChanged){
            resContainer.rendered = false;
            resContainer.virtualDom = '';
        }
        else if (tplChanged || dataChanged) {
            resContainer.rendered = false;
            resContainer.html = '';
            resContainer.toDestroyChildrenid = core_object_clone(resContainer.childrenid);
        } else {
            render_contorl_toTiggerChildren(resContainer);
        }
        if (componentChanged) {
            resContainer.componentReady = false;
        }
        if (tplChanged) {
            resContainer.tplReady = false;
        }
        if (dataChanged) {
            resContainer.dataReady = false;
        }
        if (cssChanged) {
            resContainer.cssReady = false;
        }
        if (logicChanged) {
            resContainer.logicReady = false;
        }
        !resContainer.tpl && delete resContainer.tplFn;
        !resContainer.logic && delete resContainer.logicFn;
        componentChanged && render_control_setComponent(resContainer);
        tplChanged && render_control_setTpl(resContainer);
        dataChanged && render_control_setData(resContainer, tplChanged);
        cssChanged && render_control_setCss(resContainer);
        logicChanged && render_control_setLogic(resContainer);
        resContainer.childrenChanged && render_control_setChildren(resContainer);
    }
}
var render_run_controllerLoadFn = {};
var render_run_rootScope = {};
var render_run_renderingMap = {};
var render_run_renderedTimer;
core_notice_on('stageChange', function() {
    render_run_renderingMap = {};
});
core_notice_on('rendered', function(module) {
    delete render_run_renderingMap[module.boxId];
    if (render_run_renderedTimer) {
        clearTimeout(render_run_renderedTimer);
    }
    // render_run_renderedTimer = setTimeout(function() {
        if (core_object_isEmpty(render_run_renderingMap)) {
            core_notice_trigger('allRendered');
            core_notice_trigger('allDomReady');
        }
    // }, 44);
});
//controller的boot方法
function render_run(stageBox, controller) {
    var stageBoxId, boxId, control, controllerLoadFn, controllerNs;
    var startTime = null;
    var endTime = null;
    var routerType = router_router_get().type;
    var isMain = stageBox === mainBox;
    var renderFromStage;
    var lastBoxId;
    if (typeof stageBox === 'string') {
        stageBoxId = stageBox;
        stageBox = getElementById(stageBoxId);
    } else {
        stageBoxId = stageBox.id;
        if (!stageBoxId) {
            stageBox.id = stageBoxId = render_base_idMaker();
        }
    }
    boxId = stageBoxId;
    if (render_base_stage_usable && isMain) {
        boxId = render_stage(stageBoxId, routerType);
        renderFromStage = render_stage_ani(stageBoxId, '', function(currId, lastId, renderFromStage) {
            if (currId !== lastId) {
                lastBoxId = lastId;
                core_notice_trigger(lastId + 'leave', function(transferData) {
                    if (transferData) {
                        router_history_state_set(router_router_transferData_key, transferData);
                    }
                });
                if (renderFromStage && routerType.indexOf('refresh') === -1) {
                    triggerEnter(false);
                }
            }
        });
        core_notice_trigger('stageChange', getElementById(boxId), renderFromStage);
        render_run_renderingMap[boxId] = true;
        if (!renderFromStage || routerType.indexOf('refresh') > -1) {
            async_controller();
        } else {
            render_control_triggerRendered(boxId);
        }
    } else {
        if (isMain) {
            core_notice_trigger('stageChange', getElementById(boxId), false);
        }
        render_run_renderingMap[boxId] = true;
        async_controller();
    }
    function async_controller() {
        //处理异步的controller
        render_run_controllerLoadFn[boxId] = undefined;
        if (core_object_isString(controller)) {
            render_base_controllerNs[boxId] = controller;
            controllerLoadFn = render_run_controllerLoadFn[boxId] = function(controller){
                if (controllerLoadFn === render_run_controllerLoadFn[boxId] && controller) {
                    endTime = now();
                    core_notice_trigger('ctrlTime', {
                        startTime: startTime,
                        ctrlTime: (endTime - startTime) || 0,
                        ctrlNS: controllerNs
                    });
                    render_run_controllerLoadFn[boxId] = undefined;
                    run_with_controllerobj(controller);
                }
            };
            startTime = now();
            require_global(controller, controllerLoadFn, render_error);
            return;
        } else {
            run_with_controllerobj();
        }
        ////
    }
    function run_with_controllerobj(controllerobj) {
        controller = controllerobj || controller;
        if (stageBox !== document.body) {
            //找到它的父亲
            var parentNode = stageBox.parentNode;
            var parentResContainer;
            while(parentNode && parentNode !== docElem && (!parentNode.id || !(parentResContainer = render_base_resContainer[parentNode.id]))) {
                parentNode = parentNode.parentNode;
            }
            if (parentResContainer) {
                parentResContainer.childrenid[boxId] = true;
            }
        }
        control = render_base_controlCache[boxId];
        if (control) {
            if (control._controller === controller) {
                control.refresh();
                triggerEnter(false);
                return;
            }
            if (control._controller) {
                control._destroy();
            }
        }
        render_base_controlCache[boxId] = control = render_control_main(boxId);
        if (controller) {
            control._controller = controller;
            controller(control, render_run_rootScope);
        }
        control.deal(true);
        triggerEnter(true);
    }
    function triggerEnter(isInit) {
        var transferData = router_history_state_get(router_router_transferData_key);
        if (isInit) {
            core_notice_trigger(boxId + 'init', transferData);
        }
        core_notice_trigger(boxId + 'enter', transferData, isInit);
    }
}
//@Finrila 未处理hashchange事件
var router_listen_queryTime = 5;
var router_listen_count;
var router_listen_lastStateIndex = undefined;
function router_listen() {
    router_listen_lastStateIndex = router_history_getStateIndex();
    //绑定link
    core_event_addEventListener(document, 'click', function(e) {
        //e.target 是a 有.href　下一步，或者不是a e.target.parentNode
        //向上查找三层，找到带href属性的节点，如果没有找到放弃，找到后继续
        var el = e.target;
        router_listen_count = 1;
        var hrefNode = router_listen_getHrefNode(el);
        var href = hrefNode && hrefNode.href;
        //如果A连接有target=_blank或者用户同时按下command(新tab打开)、ctrl(新tab打开)、alt(下载)、shift(新窗口打开)键时，直接跳链。
        //@shaobo3  （此处可以优化性能@Finrila）
        if (!href || href.indexOf('javascript:') === 0 || hrefNode.getAttribute("target") === "_blank" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }
        core_event_preventDefault(e);
        router_router_set(href);
    });
    var popstateTime = 0;
    core_event_addEventListener(window, 'popstate', function() {
        core_notice_trigger('popstate');
        var currentStateIndex = router_history_getStateIndex();
        if (router_listen_lastStateIndex === currentStateIndex || router_base_currentHref === href) {
            return;
        }
        var href = location.href;
        if (router_listen_lastStateIndex > currentStateIndex) {
            if (router_base_routerType === 'refresh') {
                router_base_routerType = 'back-refresh';
            } else {
                router_base_routerType = 'back';
            }
        } else {
            router_base_routerType = 'forward';
        }
        router_listen_lastStateIndex = currentStateIndex;
        router_listen_handleHrefChenged(href);
    });
}
function router_listen_getHrefNode(el) {
    if (el && router_listen_count < router_listen_queryTime) {
        router_listen_count++;
        if (el.tagName && el.tagName.toLowerCase() === 'a') {
            return el;
        }
        return router_listen_getHrefNode(el.parentNode);
    }
}
function router_listen_handleHrefChenged(url) {
    router_base_prevHref = router_base_currentHref;
    router_history_state_set(router_router_prevHref_key, router_base_prevHref);
    router_base_currentHref = url;
    router_listen_lastStateIndex = router_history_getStateIndex();
    if (router_router_get(true).config) {
        router_listen_fireRouterChange();
    } else {
        location.reload();
    }
}
//派发routerChange事件，返回router变化数据 @shaobo3
function router_listen_fireRouterChange() {
    core_notice_trigger('routerChange', router_router_get());
}
//当前访问path的变量集合,以及location相关的解析结果
var router_router_value;
var router_router_transferData;
var router_router_isRouterAPICalled;
var router_router_transferData_key = '-steel-router-transferData';
var router_router_backNum_key = '-steel-router-backNum';
var router_router_prevHref_key = '-steel-router-prevHref';
var router_router = {
    fix: function(url) {
        return core_fixUrl(router_router_get().url, url);
    },
    get: router_router_get,
    push: router_router_push,
    replace: router_router_replace,
    set: router_router_set,
    back: router_router_back,
    refresh: router_router_refresh,
    clearTransferData: router_router_clearTransferData
};
core_notice_on('popstate', router_router_onpopstate);
function router_router_onpopstate() {
    if (router_router_isRouterAPICalled) {
        router_router_isRouterAPICalled = undefined;
        router_history_state_set(router_router_transferData_key, router_router_transferData);
    } else {
        router_router_clearTransferData();
    }
    router_router_refreshValue();
}
/**
 * 获取当前路由信息
 * @return {object} 路由信息对象
 */
function router_router_get(refreshRouterValue) {
    if (refreshRouterValue || !router_router_value) {
        router_router_refreshValue();
    }
    return router_router_value;
}
/**
 * 路由前进到某个地址
 * @param  {string} url 页面地址
 * @param  {Object} data 想要传递到新页面的对象
 * @return {undefined} 
 */
function router_router_push(url, data) {
    router_router_set(url, data);
}
/**
 * 将路由替换成某个地址
 * @param  {string} url 页面地址
 * @param  {Object} data 想要传递到新页面的对象
 * @return {undefined}
 */
function router_router_replace(url, data) {
    router_router_set(url, true, data);
}
/**
 * 设置路由
 * @param  {string} url     地址 必添
 * @param  {boolean} replace 是否替换当前页面 不产生历史
 * @param  {Object} data 想要传递到新页面的对象
 * @return {undefined} 
 */
function router_router_set(url, replace, data) {
    //多态
    if (core_object_isObject(replace)) {
        data = replace;
        replace = false;
    }
    router_router_transferData = data;
    url = core_fixUrl(router_router_get().url, url || '');
    if (!router_base_singlePage || !core_crossDomainCheck(url)) {// || (android && history.length === 1)
        if (replace) {
            location.replace(url);
        } else {
            location.href = url;
        }
    } else {
        if (replace) {
            router_base_routerType = 'replace';
            router_history_replaceState(url);
        } else {
            if (router_base_currentHref !== url) {
                router_base_routerType = 'new';
                router_history_pushState(url);
            } else {
                router_base_routerType = 'refresh';
            }
        }
        router_router_isRouterAPICalled = true;
        router_router_onpopstate();
        router_listen_handleHrefChenged(url);
    }
}
/**
 * 单页面刷新
 * @return {undefined} 
 */
function router_router_refresh() {
    if (router_base_singlePage) {
        router_router_set(router_router_get().url);
    } else {
        location.reload();
    }
}
/**
 * 路由后退
 * @param  {string} url 后退后替换的地址 可以为空
 * @param  {number} num 后退的步数 默认为1步 必须为大于0的正整数
 * @param  {Object} data 想要传递到新页面的对象
 * @param  {boolean} refresh 是否在后退后刷新页面
 * @return {undefined}
 */
function router_router_back(url, num, data, refresh) {
    var options = core_argsPolymorphism(arguments, ['url', 'num', 'data', 'refresh'], ['string', 'number', 'object', 'boolean']);
    url = options.url;
    num = options.num;
    data = options.data;
    refresh = options.refresh;
    router_router_transferData = data;
    num = (core_object_isNumber(num) && num > 0) ? num : 1;
    if (router_base_singlePage) {
        if (router_history_getStateIndex() < num) {
            if (url) {
                location.replace(core_fixUrl(router_router_get().url, url));
            } else {
                location.go(-num);
            }
            return false;
        }
        core_notice_on('popstate', function popstate() {
            core_notice_off('popstate', popstate);
            var currentUrl = router_router_get().url;
            url = url && core_fixUrl(currentUrl, url);
            if (url && url !== currentUrl) {
                if (core_crossDomainCheck(url)) {
                    router_base_routerType = 'refresh';
                    router_history_replaceState(url);
                    router_router_refreshValue();
                } else {
                    location.replace(url);
                }
            } else if (refresh) {
                router_base_routerType = 'refresh';
            }
        });
        router_router_isRouterAPICalled = true;
        history.go(-num);
        return true;
    } else {
        if (url) {
            location.href = core_fixUrl(router_router_get().url, url);
        } else {
            history.go(-num);
        }
        return true;
    }
}
function router_router_clearTransferData() {
    if (router_base_singlePage) {
        router_history_state_set(router_router_transferData_key, undefined);
    }
}
/**
 * 内部使用的路由信息刷新方法
 * @return {object} 路由信息对象
 */
function router_router_refreshValue() {
    var lastRouterValue = router_router_value;
    var index = 0;
    if (router_base_singlePage) {
        index = router_history_getStateIndex()
    }
    router_router_value = router_parseURL();
    var path = router_router_value.path;
    router_router_value.path = isDebug ? path.replace(/\.(jade)$/g, '') : path;
    router_router_value.search = router_router_value.query;
    router_router_value.query = core_queryToJson(router_router_value.query);
    router_router_value.type = router_base_routerType;
    router_router_value.prev = router_base_prevHref || router_history_state_get(router_router_prevHref_key);
    router_router_value.transferData = router_history_state_get(router_router_transferData_key);
    router_router_value.state = router_history_state();
    router_router_value.index = index;
    router_router_value.lastIndex = lastRouterValue ? lastRouterValue.index : index;
    var matchResult = router_match(router_router_value);
    if (matchResult) {
        router_router_value.config = matchResult.config;
        router_router_value.param = matchResult.param;
    }
    return router_router_value;
}
function resource_fixUrl(url, type) {
    switch(type) {
        case 'js':
            path = resource_jsPath;
            break;
        case 'css':
            path = resource_cssPath;
            break;
        case 'ajax':
            path = resource_ajaxPath;
    }
    var currentRouter = router_router_get();
    //匹配参数{id} -> ?id=2
    // var urlMatch = url.match(/\{(.*?)\}/g);
    if (type === 'ajax') {
        var urlParams = {};
        var hrefParams = currentRouter.query;
        url = url.replace(/\{(.*?)\}/g, function(_, name) {
            if (hrefParams[name]) {
                urlParams[name] = hrefParams[name];
            }
            return '';
        });
        url = core_URL(url).setParams(urlParams).toString();
    }
    var result = resource_fixUrl_handle(path, url, resource_basePath, currentRouter.url.replace(/\/([^\/]+)$/, '/'));
    if ((type === 'js' || type === 'css') && !RegExp('(\\.' + type + ')$').test(url)) {
        result += '.' + type;
    }
    return result;
}
function resource_fixUrl_handle(path, url, basePath, hrefPath) {
    return core_fixUrl(path || basePath || hrefPath, url);
}/**
 * 异步调用方法 
 */
function core_asyncCall(fn, args) {
    setTimeout(function() {
        fn.apply(undefined, args);
    });
}
/** 
 * 资源队列管理
 * @params
 * url 请求资源地址
 * succ 
 * err
 * access 是否成功
 * data 资源数据
 */
function resource_queue_create(url){
    resource_queue_list[url] = [];
}
function resource_queue_push(url, succ, err){
    resource_queue_list[url].push([succ, err]);
}
function resource_queue_run(url, access, data){
	access = access ? 0 : 1;
    for(var i = 0, len = resource_queue_list[url].length; i < len; i++) {
        var item = resource_queue_list[url][i];
        item[access](data, url);
    }
}
function resource_queue_del(url) {
    url in resource_queue_list && (delete resource_queue_list[url]);
}/**
 * make an ajax request
 * @alias loader_ajax
 * @param {Object}  {
        'url': '',
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'onComplete': null,
        'onTimeout': null,
        'onFail': null,
        'method': 'get', // post or get
        'asynchronous': true,
        'contentType': 'application/x-www-form-urlencoded',
        'responseType': 'text'// xml or text or json
    };
 * @return {Void} 
 * @example
 * loader_ajax(url, {//'url':'/ajax.php',
    'args':{'id':123,'test':'true'},
    });
 */
function loader_ajax(url, onComplete, onFail){//(url, callback)
    var opts = {
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'onComplete': onComplete || emptyFunction,
        'onTimeout': onFail || emptyFunction,
        'uniqueID': null,
        'onFail': onFail || emptyFunction,
        'method': 'get', // post or get
        'asynchronous': true,
        'header' : {},
        'isEncode' : false,
        'responseType': 'json'// xml or text or json
    };
    if (url == '') {
        log('Error: ajax need url in parameters object');
        return;
    }
    var tm;
    var trans = getXHR();
    var cback = function(){
        if (trans.readyState == 4) {
            clearTimeout(tm);
            var data = '';
            if (opts['responseType'] === 'xml') {
                    data = trans.responseXML;
            }else if(opts['responseType'] === 'text'){
                    data = trans.responseText;
            }else {
                try{
                    if(trans.responseText && typeof trans.responseText === 'string'){
                        // data = $.core.json.strToJson(trans.responseText);
                        data = window['eval']('(' + trans.responseText + ')');
                    }else{
                        data = {};
                    }
                }catch(exp){
                    data = url + 'return error : data error';
                    // throw opts['url'] + 'return error : syntax error';
                }
            }
            if (trans.status == 200) {
                if (opts.onComplete != null) {
                    opts.onComplete(data);
                }
            }else if(trans.status == 0){
                //for abort;
            } else {
                if (opts.onFail != null) {
                    opts.onFail(data, trans);
                }
            }
        }
        /*else {
            if (opts['onTraning'] != null) {
                opts['onTraning'](trans);
            }
        }*/
    };
    trans.onreadystatechange = cback;
    if(!opts['header']['Content-Type']){
        opts['header']['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if(!opts['header']['X-Requested-With']){
        opts['header']['X-Requested-With'] = 'XMLHttpRequest';
    }
    if (opts['method'].toLocaleLowerCase() == 'get') {
        var url = core_URL(url, {
            'isEncodeQuery' : opts['isEncode']
        });
        url.setParams(opts['args']);
        url.setParam('__rnd', new Date().valueOf());
        trans.open(opts['method'], url.toString(), opts['asynchronous']);
        try{
            for(var k in opts['header']){
                trans.setRequestHeader(k, opts['header'][k]);
            }
        }catch(exp){
        }
        trans.send('');
    }
    else {
        trans.open(opts['method'], url, opts['asynchronous']);
        try{
            for(var k in opts['header']){
                trans.setRequestHeader(k, opts['header'][k]);
            }
        }catch(exp){
        }
        trans.send(core_jsonToQuery(opts['args'],opts['isEncode']));
    }
    if(opts['timeout']){
        tm = setTimeout(function(){
            try{
                trans.abort();
                opts['onTimeout']({}, trans);
                callback(false, {}, trans);
            }catch(exp){
            }
        }, opts['timeout']);
    }
    function getXHR(){
        var _XHR = false;
        try {
            _XHR = new XMLHttpRequest();
        } 
        catch (try_MS) {
            try {
                _XHR = new ActiveXObject("Msxml2.XMLHTTP");
            } 
            catch (other_MS) {
                try {
                    _XHR = new ActiveXObject("Microsoft.XMLHTTP");
                } 
                catch (failed) {
                    _XHR = false;
                }
            }
        }
        return _XHR;
    }
    return trans;
}
function resource_request(url, callback) {
    return loader_ajax(url, function(response, params) {
        resource_request_apiRule(url, response, params, callback);
    }, function(response) {
        callback(false, response);
    });
}
function resource_request_apiRule(url, response, params, callback) {
    if (resource_base_apiRule) {
        resource_base_apiRule(response, params, callback);
    } else {
        if (response && response.code == '100000') {
            callback(true, response);
        } else {
            log('Error: response data url("' + url + '") : The api error code is ' + (response && response.code) + '. The error reason is ' + (response && response.msg));
            callback(false, response, params);
        }
    }
}
var resource_preLoad_resMap = {};
/**
 * 支持两种资源的预加载
 * css: link节点 s-preload-css="name1|name2|name3"
 *     例如：<link s-preload-css="page/index" href="http://a.com/css/page/index.css?version=x" type="text/css" rel="stylesheet">
 * data: script节点 s-preload-data="name1|name2|name3"
 *     例：
 *        1. jsonp方式
 *           <script s-preload-data="/aj/index?page=2" s-preload-data-property="index_data" type="text/javascript">
 *               function index_callback(data) {
 *                   index_data = data;
 *               }
 *           </script>
 *           <script type="text/javascript" src="http://a.com/aj/index?page=2&callback=index_callback" async="async"></script>
 *        2. ajax方式
 *           <script s-preload-data="/aj/index?page=2" s-preload-data-property="index_data" type="text/javascript">
 *               //ajax方法定义
 *               ajax('/aj/index?page=2', function(data) {
 *                   index_data = data;
 *               }, function() {
 *                   index_data = false;
 *               })
 *           </script>
 */
function resource_preLoad_bootLoad() {
    var links = getElementsByTagName('link');
    for (var i = links.length - 1; i >= 0; i--) {
        var preloadCss = links[i].getAttribute('s-preload-css');
        if (preloadCss) {
            preloadCss = preloadCss.replace(/&amp;/gi, '&');
            var cssUrls = preloadCss.split('|');
            for (var j = cssUrls.length - 1; j >= 0; j--) {
                resource_preLoad_setRes(cssUrls[j], 'css', true, true);
            }
        }
    }
    var scripts = getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        var preloadData = script.getAttribute('s-preload-data');
        var preloadDataProperty = script.getAttribute('s-preload-data-property');
        if (preloadData) {
            preloadData = preloadData.replace(/&amp;/gi, '&');
            resource_preLoad_bootLoad_data(preloadData, preloadDataProperty);
        }
    }
}
function resource_preLoad_bootLoad_data(url, property) {
    resource_preLoad_setRes(url, 'ajax', false);
    var checkTime = 250;//250*19 超时时间
    var resource = resource_preLoad_resMap[url];
    check();
    function check() {
        if (!resource || resource.complete) {
            return;
        }
        if (property in window) {
            resource.complete = true;
            var response = window[property];
            if (response === 'error') {
                callback(false, null);
            } else {
                resource_request_apiRule(url, response, {}, function(success, response) {
                    callback(success, response);
                });
            }
        } else {
            if (checkTime > 0) {
                setTimeout(check, 19);
            } else {
                resource.complete = true;
                callback(false, null);
            }
        }
        checkTime--;
    }
    function callback(success, response) {
        var callbackList = resource[success ? 'onsuccess' : 'onfail'];
        resource[success ? 'success' : 'fail'] = response;
        for (var i = 0, l = callbackList.length; i < l; i++) {
            if (callbackList[i]) {
                callbackList[i](response);
            }
        }
    }
}
function resource_preLoad_setRes(url, type, complete, success, fail) {
    resource_preLoad_resMap[url] = {
        type: type,
        complete: complete,
        success: success,
        fail: fail,
        onsuccess: [],
        onfail: []
    };
}
/**
 * 得到预加载的资源
 * @param  {string} url 
 */
function resource_preLoad_get(url) {
    return resource_preLoad_resMap[url];
}
function loader_js(url, callback){
    var entityList = {};
    var opts = {
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'isEncode' : false
    };
    var js, requestTimeout;
    var uniqueID = core_uniqueKey();
    js = entityList[uniqueID];
    if (js != null && !IE) {
        core_dom_removeNode(js);
        js = null;
    }
    if (js == null) {
        js = entityList[uniqueID] = core_dom_createElement('script');
    }
    js.charset = opts.charset;
    js.id = 'scriptRequest_script_' + uniqueID;
    js.type = 'text/javascript';
    if (callback != null) {
        if (IE) {
            js['onreadystatechange'] = function(){
                if (js.readyState.toLowerCase() == 'loaded' || js.readyState.toLowerCase() == 'complete') {
                    try{
                        clearTimeout(requestTimeout);
                        head.removeChild(js);
                        js['onreadystatechange'] = null;
                    }catch(exp){
                    }
                    callback(true);
                }
            };
        }
        else {
            js['onload'] = function(){
                try{
                    clearTimeout(requestTimeout);
                    core_dom_removeNode(js);
                }catch(exp){}
                callback(true);
            };
        }
    }
    js.src = core_URL(url,{
        'isEncodeQuery' : opts['isEncode']
    }).setParams(opts.args).toString();
    head.appendChild(js);
    if (opts.timeout > 0) {
        requestTimeout = setTimeout(function(){
            try{
                head.removeChild(js);
            }catch(exp){
            }
            callback(false);
        }, opts.timeout);
    }
    return js;
}
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
function loader_css(url, callback, load_ID) {
    var load_div = null;
    var domID = core_uniqueKey();
    var timer = null;
    var _rTime = 500;//5000毫秒
    load_div = core_dom_createElement('div');
    core_dom_setAttribute(load_div, 'id', load_ID);
    core_hideDiv_appendChild(load_div);
    if (check()) {
        return;
    }
    var link = core_dom_createElement('link');
    core_dom_setAttribute(link, 'rel', 'Stylesheet');
    core_dom_setAttribute(link, 'type', 'text/css');
    core_dom_setAttribute(link, 'charset', 'utf-8');
    core_dom_setAttribute(link, 'id', 'link_' + load_ID);
    core_dom_setAttribute(link, 'href', url);
    head.appendChild(link);
    timer = function() {
        if (check()) {
            return;
        }
        if (--_rTime > 0) {
            setTimeout(timer, 10);
        } else {
            log('Error: css("' + url + '" timeout!');
            core_hideDiv_removeChild(load_div);
            callback(false);
        }
    };
    setTimeout(timer, 50);
    function check() {
        var result = parseInt(window.getComputedStyle ? getComputedStyle(load_div, null)['height'] : load_div.currentStyle && load_div.currentStyle['height']) === 42;
        if (result) {
            load_div && core_hideDiv_removeChild(load_div);
            callback(true);
        }
        return result;
    }
}
function loader_css_remove(load_ID) {
    var linkDom = getElementById('link_' + load_ID);
    if (linkDom) {
        core_dom_removeNode(linkDom);
        return true;
    }
    return false;
}
var resource_res_cssPrefix = 'S_CSS_';
var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle('js', name, succ, err);
    },
    css: function(name, succ, err) {
        resource_res_handle('css', name, succ, err);
    },
    get: function(name, succ, err) {
        resource_res_handle('ajax', name, succ, err);
    },
    removeCss: function(name) {
        return loader_css_remove(resource_res_getCssId(name));
    }
};
function resource_res_handle(type, name, succ, err) {
    var nameObj = resource_preLoad_get(name);
    if (router_router_get().type === 'init' && nameObj) {
        if (nameObj.complete) {
            if (nameObj.success) {
                succ && succ.apply(undefined, [].concat(nameObj.success));
            } else {
                err && err.apply(undefined, [].concat(nameObj.fail));
            }
        } else {
            nameObj.onsuccess.push(succ);
            nameObj.onfail.push(err);
        }
    } else {
        resource_res_do(type, name, succ, err);
    }
}
function resource_res_do(type, name, succ, err) {
    var cssId;
    if (type === 'css') {
        cssId = resource_res_getCssId(name);
    }
    var hasProtocol = core_hasProtocol(name);
    var url = name, loader;
    if (!hasProtocol) {
        url = resource_fixUrl(name, type);
        if (type !== 'ajax' && resource_base_version) {
            url += '?version=' + resource_base_version;
        }
    }
    if(resource_queue_list[url]) {
        resource_queue_push(url, succ, err);
    } else {
        resource_queue_create(url);
        resource_queue_push(url, succ, err);
        switch(type) {
            case 'js':
                loader_js(url, callback);
                break;
            case 'css':
                loader_css(url, callback, cssId);
                break;
            case 'ajax':
                resource_request(url, callback);
                break;
        }
    }
    function callback(access, data) {
        resource_queue_run(url, access, data);
        resource_queue_del(url);
    }
}
function resource_res_getCssId(path) {
    return path && resource_res_cssPrefix + path.replace(/(\.css)$/i, '').replace(/\//g, '_');
}
//外部异步调用require方法
function require_global(deps, complete, errcb, currNs, runDeps) {
    var depNs;
    var depDefined = 0;
    var errored = 0;
    var baseModulePath = currNs && core_urlFolder(currNs);
    deps = [].concat(deps);
    for (var i = 0, len = deps.length; i < len; i++) {
        depNs = deps[i] = core_nameSpaceFix(deps[i], baseModulePath);
        if (require_base_module_loaded[depNs]) {
            checkDepDefined(depNs);
        } else {
            ! function(depNs) {
                resource_res.js(depNs, function() {
                    if (core_hasProtocol(depNs)) {
                        require_base_module_defined[depNs] = true;
                        require_base_module_loaded[depNs] = true;
                    }
                    checkDepDefined(depNs);
                }, function() {
                    errored++;
                });
            }(depNs);
        }
    }
    function check() {
        if (deps.length <= depDefined) {
            if (errored) {
                errcb();
            } else {
                var runner_result = [];
                if (runDeps === undefined || runDeps === true) {
                    runner_result = require_runner(deps);
                }
                complete && complete.apply(window, runner_result);
            }
        }
    }
    function checkDepDefined(depNs) {
        if (require_base_module_defined[depNs]) {
            depDefined++;
            check();
        } else {
            core_notice_on(require_base_event_defined, function definedFn(ns) {
                if (depNs === ns) {
                    core_notice_off(require_base_event_defined, definedFn);
                    depDefined++;
                    check();
                }
            });
        }
    }
}
//内部同步调用require方法
function require_runner_makeRequire(currNs) {
    var basePath = core_urlFolder(currNs);
    return require;
    function require(ns) {
        if (core_object_typeof(ns) === 'array') {
            var paramList = core_array_makeArray(arguments);
            paramList[3] = paramList[3] || currNs;
            return require_global.apply(window, paramList);
        }
        ns = core_nameSpaceFix(ns, basePath);
        if (!require_base_module_defined[ns]) {
            log('Error: ns("' + ns + '") is undefined!');
            return;
        }
        if (!(ns in require_base_module_runed)) {
            require_runner(ns);
        }
        return require_base_module_runed[ns];
    }
}
//运行define列表，并返回实例集
function require_runner(pkg, basePath) {
    pkg = [].concat(pkg);
    var i, len;
    var ns, nsConstructor, module;
    var resultList = [];
    for (i = 0, len = pkg.length; i < len; i++) {
        ns = core_nameSpaceFix(pkg[i], basePath);
        nsConstructor = require_base_module_fn[ns];
        if (!nsConstructor) {
            log('Warning: ns("' + ns + '") has not constructor!');
            resultList.push(undefined);
        } else {
            if (!require_base_module_runed[ns]) {
                if (require_base_module_deps[ns]) {
                    require_runner(require_base_module_deps[ns], core_urlFolder(ns));
                }
                module = {
                    exports: {}
                };
                require_base_module_runed[ns] = nsConstructor.apply(window, [require_runner_makeRequire(ns), module.exports, module]) || module.exports;
            }
            resultList.push(require_base_module_runed[ns]);
        }
    }
    return resultList;
}
//全局define
function require_define(ns, deps, construtor) {
    if (require_base_module_defined[ns]) {
        return;
    }
    require_base_module_loaded[ns] = true;
    require_base_module_deps[ns] = construtor ? (deps || []) : [];
    require_base_module_fn[ns] = construtor || deps;
    deps = require_base_module_deps[ns];
    if (deps.length > 0) {
        require_global(deps, doDefine, function() {
            log('Error: ns("' + ns + '") deps loaded error!', '');
        }, ns, false);
    } else {
        doDefine();
    }
    function doDefine() {
        require_base_module_defined[ns] = true;
        core_notice_trigger(require_base_event_defined, ns);
        log('Debug: define ns("' + ns + '")');
    }
}
 //暂不做
var resource_config_slash = '/';
config_push(function (parseParamFn) {
    resource_jsPath = parseParamFn('jsPath', resource_jsPath);
    resource_cssPath = parseParamFn('cssPath', resource_cssPath);
    resource_ajaxPath = parseParamFn('ajaxPath', resource_ajaxPath);
    resource_basePath = parseParamFn('basePath', resource_config_slash);
    resource_base_apiRule = parseParamFn('defApiRule', resource_base_apiRule);
    resource_base_version = parseParamFn('version', resource_base_version);
});
function resource_boot() {
    resource_preLoad_bootLoad();
}
 /**
 * 渲染管理器的主页面
 */
var render_render_stage = {
    getBox: render_stage_getBox,
    getScrollBox: render_stage_getScrollBox
};
config_push(function(parseParamFn) {
    if (isHTML5) {
        render_base_dataCache_usable = parseParamFn('dataCache', render_base_dataCache_usable);
        if ((iphone && iphoneVersion >= 8.0 && webkit) || (android && androidVersion >= 4.4 && webkit)) {
            // return;
            //目前限制使用这个功能，这个限制会优先于用户的配置
            render_base_stage_usable = parseParamFn('stage', render_base_stage_usable);
            if (render_base_stage_usable) {
                render_base_stageCache_usable = parseParamFn('stageCache', render_base_stageCache_usable);
                render_base_stageChange_usable = parseParamFn('stageChange', render_base_stageChange_usable);
                render_base_stageDefaultHTML = parseParamFn('stageDefaultHTML', render_base_stageDefaultHTML);
                render_base_stage_maxLength = parseParamFn('stageMaxLength', render_base_stage_maxLength);
            }
        }
    }
    render_base_useCssPrefix_usable = parseParamFn('useCssPrefix', render_base_useCssPrefix_usable);
});/**
 * 渲染的启动入口
 */
function render_boot() {
    render_stage_init();
}
 /**
 * 路由配置
 */
config_push(router_config);
function router_config(parseParamFn, config) {
  router_base_routerTable = parseParamFn('router', router_base_routerTable);
  // @Finrila hash模式处理不可用状态，先下掉
  // router_base_useHash = parseParamFn('useHash', router_base_useHash);
  router_base_singlePage = isHTML5 ? parseParamFn('singlePage', router_base_singlePage) : false;
}/**
 * 路由启动接口
 * 1、设置侦听
 * 2、主动响应第一次的url(第一次是由后端渲染的，如果没有真实文件，无法启动页面)
 *
 */
/**
 * router.use
 * 设置单条路由规则
 * 路由语法说明：
 * 1、path中的变量定义参考express
 * 2、支持query和hash
 * 3、低版浏览器支持用hash模式来设置路由
 */
/**
 * Turn an Express-style path string such as /user/:name into a regular expression.
 *
 */
/**
 * 判断对象是否为数组
 * @param {Array} o
 * @return {Boolean}
 * @example
 * var li1 = [1,2,3]
 * var bl2 = core_array_isArray(li1);
 * bl2 === TRUE
 */
var core_array_isArray = Array.isArray ? function(arr) {
	return Array.isArray(arr);
} : function(arr){
	return 'array' === core_object_typeof(arr);
};
/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var router_pathToRegexp_PATH_REGEXP = RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
    // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
    '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
    // Match regexp special characters that are always escaped.
    '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');
/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function router_pathToRegexp_escapeGroup(group) {
    return group.replace(/([=!:$\/()])/g, '\\$1');
}
/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function router_pathToRegexp_attachKeys(re, keys) {
    re.keys = keys;
    return re;
}
/**
 * Get the router_pathToRegexp_flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function router_pathToRegexp_flags(options) {
    return options.sensitive ? '' : 'i';
}
/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function router_pathToRegexp_regexpToRegexp(path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);
    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                delimiter: null,
                optional: false,
                repeat: false
            });
        }
    }
    return router_pathToRegexp_attachKeys(path, keys);
}
/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function router_pathToRegexp_arrayToRegexp(path, keys, options) {
    var parts = [];
    for (var i = 0; i < path.length; i++) {
        parts.push(router_pathToRegexp(path[i], keys, options).source);
    }
    var regexp = RegExp('(?:' + parts.join('|') + ')', router_pathToRegexp_flags(options));
    return router_pathToRegexp_attachKeys(regexp, keys);
}
/**
 * Replace the specific tags with regexp strings.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @return {String}
 */
function router_pathToRegexp_replacePath(path, keys) {
    var index = 0;
    function replace(_, escaped, prefix, key, capture, group, suffix, escape) {
        if (escaped) {
            return escaped;
        }
        if (escape) {
            return '\\' + escape;
        }
        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        keys.push({
            name: key || index++,
            delimiter: prefix || '/',
            optional: optional,
            repeat: repeat
        });
        prefix = prefix ? ('\\' + prefix) : '';
        capture = router_pathToRegexp_escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');
        if (repeat) {
            capture = capture + '(?:' + prefix + capture + ')*';
        }
        if (optional) {
            return '(?:' + prefix + '(' + capture + '))?';
        }
        // Basic parameter support.
        return prefix + '(' + capture + ')';
    }
    return path.replace(router_pathToRegexp_PATH_REGEXP, replace);
}
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function router_pathToRegexp(path, keys, options) {
    keys = keys || [];
    if (!core_array_isArray(keys)) {
        options = keys;
        keys = [];
    } else if (!options) {
        options = {};
    }
    if (path instanceof window.RegExp) {
        return router_pathToRegexp_regexpToRegexp(path, keys, options);
    }
    if (core_array_isArray(path)) {
        return router_pathToRegexp_arrayToRegexp(path, keys, options);
    }
    var strict = options.strict;
    var end = options.end !== false;
    var route = router_pathToRegexp_replacePath(path, keys);
    var endsWithSlash = path.charAt(path.length - 1) === '/';
    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
    }
    if (end) {
        route += '$';
    } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
    }
    return router_pathToRegexp_attachKeys(RegExp('^' + route, router_pathToRegexp_flags(options)), keys);
}
function router_use(path, config) {
    var key, value, _results;
    if (typeof path === 'object' && !(path instanceof window.RegExp)) {
        //批量设置
        _results = [];
        for (key in path) {
            value = path[key];
            _results.push(router_use(key, value));
        }
        return _results;
    } else {
        //单条设置
        var keys = [];
        var pathRegexp = router_pathToRegexp(path, keys);
        return router_base_routerTableReg.push({
            pathRegexp: pathRegexp,
            config: config,
            keys: keys
        });
    }
}
function router_boot() {
    for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
        var items = router_base_routerTable[i];
        router_use(items[0], items);
    }
    router_router_clearTransferData();
    if (router_router_get(true).config) {
        router_listen_fireRouterChange();
    }
    //浏览器支持HTML5，且应用设置为单页面应用时，绑定路由侦听； @shaobo3
    isHTML5 && router_base_singlePage && router_listen();
}
  config_push(function(parseParamFn, config) {
    isDebug = parseParamFn('debug', isDebug);
    logLevel = parseParamFn('logLevel', logLevel);
    if (!config.logLevel && !isDebug) {
      logLevel = 'Error';
    }
    mainBox = parseParamFn('mainBox', mainBox);
    if (core_object_isString(mainBox)) {
      mainBox = getElementById(mainBox);
    }
  });
  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.stage = render_render_stage;
  steel.router = router_router;
  steel.on = core_notice_on;
  steel.off = core_notice_off;
  steel.setExtTplData = render_control_setExtTplData;
  steel.require = require_global;
  steel.config = config;
  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    require_global(ns, function() {
      resource_boot();
      render_boot();
      router_boot();
    });
  };
  steel._destroyByNode = function(node) {
    var id = node && node.id;
    var resContainer;
    if (id && (resContainer = render_base_resContainer[id])) {
      render_control_destroyLogic(resContainer);
      render_control_destroyChildren(resContainer.toDestroyChildrenid);
    }
  };
  core_notice_on('routerChange', function(routerValue) {
    var config = routerValue.config;
    var controller = config[1];
    render_run(mainBox, controller);
    log("Info: routerChange", mainBox, controller, routerValue.type);
  });
  window.steel = steel;
}(window);
/*!
 * react-lite.js v0.15.9
 * (c) 2016 Jade Gu
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.React = factory();
}(this, function () { 'use strict';
  var SVGNamespaceURI = 'http://www.w3.org/2000/svg';
  var COMPONENT_ID = 'liteid';
  var VELEMENT = 2;
  var VSTATELESS = 3;
  var VCOMPONENT = 4;
  var VCOMMENT = 5;
  var refs = null;
  function createVelem(type, props) {
      return {
          vtype: VELEMENT,
          type: type,
          props: props,
          refs: refs
      };
  }
  function createVstateless(type, props) {
      return {
          vtype: VSTATELESS,
          id: getUid(),
          type: type,
          props: props
      };
  }
  function createVcomponent(type, props) {
      return {
          vtype: VCOMPONENT,
          id: getUid(),
          type: type,
          props: props,
          refs: refs
      };
  }
  function createVcomment(comment) {
      return {
          vtype: VCOMMENT,
          comment: comment
      };
  }
  function initVnode(vnode, parentContext, namespaceURI) {
      var vtype = vnode.vtype;
      var node = null;
      if (!vtype) {
          node = document.createTextNode(vnode);
      } else if (vtype === VELEMENT) {
          node = initVelem(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMPONENT) {
          node = initVcomponent(vnode, parentContext, namespaceURI);
      } else if (vtype === VSTATELESS) {
          node = initVstateless(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMMENT) {
          node = document.createComment(vnode.comment);
      }
      return node;
  }
  function destroyVnode(vnode, node) {
      var vtype = vnode.vtype;
      if (vtype === VELEMENT) {
          destroyVelem(vnode, node);
      } else if (vtype === VCOMPONENT) {
          destroyVcomponent(vnode, node);
      } else if (vtype === VSTATELESS) {
          destroyVstateless(vnode, node);
      }
  }
  function initVelem(velem, parentContext, namespaceURI) {
      var type = velem.type;
      var props = velem.props;
      var node = null;
      if (type === 'svg' || namespaceURI === SVGNamespaceURI) {
          node = document.createElementNS(SVGNamespaceURI, type);
          namespaceURI = SVGNamespaceURI;
      } else {
          node = document.createElement(type);
      }
      var children = props.children;
      var vchildren = node.vchildren = [];
      if (isArr(children)) {
          flattenChildren(children, collectChild, vchildren);
      } else {
          collectChild(children, vchildren);
      }
      for (var i = 0, len = vchildren.length; i < len; i++) {
          node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI));
      }
      var isCustomComponent = type.indexOf('-') >= 0 || props.is != null;
      setProps(node, props, isCustomComponent);
      attachRef(velem.refs, velem.ref, node);
      return node;
  }
  function collectChild(child, children) {
      if (child != null && typeof child !== 'boolean') {
          children[children.length] = child.vtype ? child : '' + child;
      }
  }
  function updateVelem(velem, newVelem, node, parentContext) {
      var props = velem.props;
      var type = velem.type;
      var newProps = newVelem.props;
      var oldHtml = props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html;
      var newChildren = newProps.children;
      var vchildren = node.vchildren;
      var childNodes = node.childNodes;
      var namespaceURI = node.namespaceURI;
      var isCustomComponent = type.indexOf('-') >= 0 || props.is != null;
      var vchildrenLen = vchildren.length;
      var newVchildren = node.vchildren = [];
      if (isArr(newChildren)) {
          flattenChildren(newChildren, collectChild, newVchildren);
      } else {
          collectChild(newChildren, newVchildren);
      }
      var newVchildrenLen = newVchildren.length;
      if (oldHtml == null && vchildrenLen) {
          var shouldRemove = null;
          var patches = Array(newVchildrenLen);
          for (var i = 0; i < vchildrenLen; i++) {
              var vnode = vchildren[i];
              for (var j = 0; j < newVchildrenLen; j++) {
                  if (patches[j]) {
                      continue;
                  }
                  var newVnode = newVchildren[j];
                  if (vnode === newVnode) {
                      patches[j] = {
                          vnode: vnode,
                          node: childNodes[i]
                      };
                      vchildren[i] = null;
                      break;
                  }
              }
          }
          outer: for (var i = 0; i < vchildrenLen; i++) {
              var vnode = vchildren[i];
              if (vnode === null) {
                  continue;
              }
              var _type = vnode.type;
              var key = vnode.key;
              var _refs = vnode.refs;
              var childNode = childNodes[i];
              for (var j = 0; j < newVchildrenLen; j++) {
                  if (patches[j]) {
                      continue;
                  }
                  var newVnode = newVchildren[j];
                  if (newVnode.type === _type && newVnode.key === key && newVnode.refs === _refs) {
                      patches[j] = {
                          vnode: vnode,
                          node: childNode
                      };
                      continue outer;
                  }
              }
              if (!shouldRemove) {
                  shouldRemove = [];
              }
              shouldRemove[shouldRemove.length] = childNode;
              // shouldRemove.push(childNode)
              destroyVnode(vnode, childNode);
          }
          if (shouldRemove) {
              for (var i = 0, len = shouldRemove.length; i < len; i++) {
                  node.removeChild(shouldRemove[i]);
              }
          }
          for (var i = 0; i < newVchildrenLen; i++) {
              var newVnode = newVchildren[i];
              var patchItem = patches[i];
              if (patchItem) {
                  var vnode = patchItem.vnode;
                  var newChildNode = patchItem.node;
                  if (newVnode !== vnode) {
                      var vtype = newVnode.vtype;
                      if (!vtype) {
                          // textNode
                          newChildNode.newText = newVnode;
                          pendingTextUpdater[pendingTextUpdater.length] = newChildNode;
                          // newChildNode.nodeValue = newVnode
                          // newChildNode.replaceData(0, vnode.length, newVnode)
                      } else if (vtype === VELEMENT) {
                              newChildNode = updateVelem(vnode, newVnode, newChildNode, parentContext);
                          } else if (vtype === VCOMPONENT) {
                              newChildNode = updateVcomponent(vnode, newVnode, newChildNode, parentContext);
                          } else if (vtype === VSTATELESS) {
                              newChildNode = updateVstateless(vnode, newVnode, newChildNode, parentContext);
                          }
                  }
                  var currentNode = childNodes[i];
                  if (currentNode !== newChildNode) {
                      node.insertBefore(newChildNode, currentNode || null);
                  }
              } else {
                  var newChildNode = initVnode(newVnode, parentContext, namespaceURI);
                  node.insertBefore(newChildNode, childNodes[i] || null);
              }
          }
          node.props = props;
          node.newProps = newProps;
          node.isCustomComponent = isCustomComponent;
          pendingPropsUpdater[pendingPropsUpdater.length] = node;
      } else {
          // should patch props first, make sure innerHTML was cleared
          patchProps(node, props, newProps, isCustomComponent);
          for (var i = 0; i < newVchildrenLen; i++) {
              node.appendChild(initVnode(newVchildren[i], parentContext, namespaceURI));
          }
      }
      if (velem.ref !== newVelem.ref) {
          detachRef(velem.refs, velem.ref);
          attachRef(newVelem.refs, newVelem.ref, node);
      }
      return node;
  }
  function destroyVelem(velem, node) {
      var props = velem.props;
      var vchildren = node.vchildren;
      var childNodes = node.childNodes;
      for (var i = 0, len = vchildren.length; i < len; i++) {
          destroyVnode(vchildren[i], childNodes[i]);
      }
      detachRef(velem.refs, velem.ref);
      node.eventStore = node.vchildren = null;
      for (var key in props) {
          if (props.hasOwnProperty(key) && EVENT_KEYS.test(key)) {
              key = getEventName(key);
              if (notBubbleEvents[key] === true) {
                  node[key] = null;
              }
          }
      }
  }
  function initVstateless(vstateless, parentContext, namespaceURI) {
      var vnode = renderVstateless(vstateless, parentContext);
      var node = initVnode(vnode, parentContext, namespaceURI);
      node.cache = node.cache || {};
      node.cache[vstateless.id] = vnode;
      return node;
  }
  function updateVstateless(vstateless, newVstateless, node, parentContext) {
      var id = vstateless.id;
      var vnode = node.cache[id];
      delete node.cache[id];
      var newVnode = renderVstateless(newVstateless, parentContext);
      var newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
      newNode.cache = newNode.cache || {};
      newNode.cache[newVstateless.id] = newVnode;
      if (newNode !== node) {
          syncCache(newNode.cache, node.cache, newNode);
      }
      return newNode;
  }
  function destroyVstateless(vstateless, node) {
      var id = vstateless.id;
      var vnode = node.cache[id];
      delete node.cache[id];
      destroyVnode(vnode, node);
  }
  function renderVstateless(vstateless, parentContext) {
      var factory = vstateless.type;
      var props = vstateless.props;
      var componentContext = getContextByTypes(parentContext, factory.contextTypes);
      var vnode = factory(props, componentContext);
      if (vnode && vnode.render) {
          vnode = vnode.render();
      }
      if (vnode === null || vnode === false) {
          vnode = createVcomment('react-empty: ' + getUid());
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + factory.name + '#render:You may have returned undefined, an array or some other invalid object');
      }
      return vnode;
  }
  function initVcomponent(vcomponent, parentContext, namespaceURI) {
      var Component = vcomponent.type;
      var props = vcomponent.props;
      var id = vcomponent.id;
      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      var component = new Component(props, componentContext);
      var updater = component.$updater;
      var cache = component.$cache;
      cache.parentContext = parentContext;
      updater.isPending = true;
      component.props = component.props || props;
      component.context = component.context || componentContext;
      if (component.componentWillMount) {
          component.componentWillMount();
          component.state = updater.getState();
      }
      var vnode = renderComponent(component, parentContext);
      var node = initVnode(vnode, vnode.context, namespaceURI);
      node.cache = node.cache || {};
      node.cache[id] = component;
      cache.vnode = vnode;
      cache.node = node;
      cache.isMounted = true;
      pendingComponents.push(component);
      attachRef(vcomponent.refs, vcomponent.ref, component);
      return node;
  }
  function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
      var id = vcomponent.id;
      var component = node.cache[id];
      var updater = component.$updater;
      var cache = component.$cache;
      var Component = newVcomponent.type;
      var nextProps = newVcomponent.props;
      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      delete node.cache[id];
      node.cache[newVcomponent.id] = component;
      cache.parentContext = parentContext;
      if (component.componentWillReceiveProps) {
          updater.isPending = true;
          component.componentWillReceiveProps(nextProps, componentContext);
          updater.isPending = false;
      }
      updater.emitUpdate(nextProps, componentContext);
      if (vcomponent.ref !== newVcomponent.ref) {
          detachRef(vcomponent.refs, vcomponent.ref);
          attachRef(newVcomponent.refs, newVcomponent.ref, component);
      }
      return cache.node;
  }
  function destroyVcomponent(vcomponent, node) {
      var id = vcomponent.id;
      var component = node.cache[id];
      var cache = component.$cache;
      delete node.cache[id];
      detachRef(vcomponent.refs, vcomponent.ref);
      component.setState = component.forceUpdate = noop;
      if (component.componentWillUnmount) {
          component.componentWillUnmount();
      }
      destroyVnode(cache.vnode, node);
      delete component.setState;
      cache.isMounted = false;
      cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null;
  }
  function getContextByTypes(curContext, contextTypes) {
      var context = {};
      if (!contextTypes || !curContext) {
          return context;
      }
      for (var key in contextTypes) {
          if (contextTypes.hasOwnProperty(key)) {
              context[key] = curContext[key];
          }
      }
      return context;
  }
  function renderComponent(component, parentContext) {
      refs = component.refs;
      var vnode = component.render();
      if (vnode === null || vnode === false) {
          vnode = createVcomment('react-empty: ' + getUid());
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + component.constructor.name + '#render:You may have returned undefined, an array or some other invalid object');
      }
      var curContext = refs = null;
      if (component.getChildContext) {
          curContext = component.getChildContext();
      }
      if (curContext) {
          curContext = extend(extend({}, parentContext), curContext);
      } else {
          curContext = parentContext;
      }
      vnode.context = curContext;
      return vnode;
  }
  function batchUpdateDOM() {
      clearPendingPropsUpdater();
      clearPendingTextUpdater();
      clearPendingComponents();
  }
  var pendingComponents = [];
  function clearPendingComponents() {
      var len = pendingComponents.length;
      if (!len) {
          return;
      }
      var components = pendingComponents;
      pendingComponents = [];
      var i = -1;
      while (len--) {
          var component = components[++i];
          var updater = component.$updater;
          if (component.componentDidMount) {
              component.componentDidMount();
          }
          updater.isPending = false;
          updater.emitUpdate();
      }
  }
  var pendingTextUpdater = [];
  var clearPendingTextUpdater = function clearPendingTextUpdater() {
      var len = pendingTextUpdater.length;
      if (!len) {
          return;
      }
      var list = pendingTextUpdater;
      pendingTextUpdater = [];
      for (var i = 0; i < len; i++) {
          var node = list[i];
          node.nodeValue = node.newText;
      }
  };
  var pendingPropsUpdater = [];
  var clearPendingPropsUpdater = function clearPendingPropsUpdater() {
      var len = pendingPropsUpdater.length;
      if (!len) {
          return;
      }
      var list = pendingPropsUpdater;
      pendingPropsUpdater = [];
      for (var i = 0; i < len; i++) {
          var node = list[i];
          patchProps(node, node.props, node.newProps, node.isCustomComponent);
          node.props = node.newProps = null;
      }
  };
  function compareTwoVnodes(vnode, newVnode, node, parentContext) {
      var newNode = node;
      if (newVnode == null) {
          // remove
          destroyVnode(vnode, node);
          node.parentNode.removeChild(node);
      } else if (vnode.type !== newVnode.type || newVnode.key !== vnode.key) {
          // replace
          destroyVnode(vnode, node);
          newNode = initVnode(newVnode, parentContext, node.namespaceURI);
          node.parentNode.replaceChild(newNode, node);
      } else if (vnode !== newVnode) {
          // same type and same key -> update
          var vtype = vnode.vtype;
          if (vtype === VELEMENT) {
              newNode = updateVelem(vnode, newVnode, node, parentContext);
          } else if (vtype === VCOMPONENT) {
              newNode = updateVcomponent(vnode, newVnode, node, parentContext);
          } else if (vtype === VSTATELESS) {
              newNode = updateVstateless(vnode, newVnode, node, parentContext);
          }
      }
      return newNode;
  }
  function getDOMNode() {
      return this;
  }
  function attachRef(refs, refKey, refValue) {
      if (!refs || refKey == null || !refValue) {
          return;
      }
      if (refValue.nodeName && !refValue.getDOMNode) {
          // support react v0.13 style: this.refs.myInput.getDOMNode()
          refValue.getDOMNode = getDOMNode;
      }
      if (isFn(refKey)) {
          refKey(refValue);
      } else {
          refs[refKey] = refValue;
      }
  }
  function detachRef(refs, refKey) {
      if (!refs || refKey == null) {
          return;
      }
      if (isFn(refKey)) {
          refKey(null);
      } else {
          delete refs[refKey];
      }
  }
  function syncCache(cache, oldCache, node) {
      for (var key in oldCache) {
          if (!oldCache.hasOwnProperty(key)) {
              continue;
          }
          var value = oldCache[key];
          cache[key] = value;
          // is component, update component.$cache.node
          if (value.forceUpdate) {
              value.$cache.node = node;
          }
      }
  }
  var updateQueue = {
  	updaters: [],
  	isPending: false,
  	add: function add(updater) {
  		this.updaters.push(updater);
  	},
  	batchUpdate: function batchUpdate() {
  		if (this.isPending) {
  			return;
  		}
  		this.isPending = true;
  		/*
     each updater.update may add new updater to updateQueue
     clear them with a loop
     event bubbles from bottom-level to top-level
     reverse the updater order can merge some props and state and reduce the refresh times
     see Updater.update method below to know why
    */
  		var updaters = this.updaters;
  		var updater = undefined;
  		while (updater = updaters.pop()) {
  			updater.updateComponent();
  		}
  		this.isPending = false;
  	}
  };
  function Updater(instance) {
  	this.instance = instance;
  	this.pendingStates = [];
  	this.pendingCallbacks = [];
  	this.isPending = false;
  	this.nextProps = this.nextContext = null;
  	this.clearCallbacks = this.clearCallbacks.bind(this);
  }
  Updater.prototype = {
  	emitUpdate: function emitUpdate(nextProps, nextContext) {
  		this.nextProps = nextProps;
  		this.nextContext = nextContext;
  		// receive nextProps!! should update immediately
  		nextProps || !updateQueue.isPending ? this.updateComponent() : updateQueue.add(this);
  	},
  	updateComponent: function updateComponent() {
  		var instance = this.instance;
  		var pendingStates = this.pendingStates;
  		var nextProps = this.nextProps;
  		var nextContext = this.nextContext;
  		if (nextProps || pendingStates.length > 0) {
  			nextProps = nextProps || instance.props;
  			nextContext = nextContext || instance.context;
  			this.nextProps = this.nextContext = null;
  			// merge the nextProps and nextState and update by one time
  			shouldUpdate(instance, nextProps, this.getState(), nextContext, this.clearCallbacks);
  		}
  	},
  	addState: function addState(nextState) {
  		if (nextState) {
  			this.pendingStates.push(nextState);
  			if (!this.isPending) {
  				this.emitUpdate();
  			}
  		}
  	},
  	replaceState: function replaceState(nextState) {
  		var pendingStates = this.pendingStates;
  		pendingStates.pop();
  		// push special params to point out should replace state
  		pendingStates.push([nextState]);
  	},
  	getState: function getState() {
  		var instance = this.instance;
  		var pendingStates = this.pendingStates;
  		var state = instance.state;
  		var props = instance.props;
  		if (pendingStates.length) {
  			state = extend({}, state);
  			eachItem(pendingStates, function (nextState) {
  				// replace state
  				if (isArr(nextState)) {
  					state = extend({}, nextState[0]);
  					return;
  				}
  				if (isFn(nextState)) {
  					nextState = nextState.call(instance, state, props);
  				}
  				extend(state, nextState);
  			});
  			pendingStates.length = 0;
  		}
  		return state;
  	},
  	clearCallbacks: function clearCallbacks() {
  		var pendingCallbacks = this.pendingCallbacks;
  		var instance = this.instance;
  		if (pendingCallbacks.length > 0) {
  			this.pendingCallbacks = [];
  			eachItem(pendingCallbacks, function (callback) {
  				return callback.call(instance);
  			});
  		}
  	},
  	addCallback: function addCallback(callback) {
  		if (isFn(callback)) {
  			this.pendingCallbacks.push(callback);
  		}
  	}
  };
  function Component(props, context) {
  	this.$updater = new Updater(this);
  	this.$cache = { isMounted: false };
  	this.props = props;
  	this.state = {};
  	this.refs = {};
  	this.context = context;
  }
  Component.prototype = {
  	constructor: Component,
  	// getChildContext: _.noop,
  	// componentWillUpdate: _.noop,
  	// componentDidUpdate: _.noop,
  	// componentWillReceiveProps: _.noop,
  	// componentWillMount: _.noop,
  	// componentDidMount: _.noop,
  	// componentWillUnmount: _.noop,
  	// shouldComponentUpdate(nextProps, nextState) {
  	// 	return true
  	// },
  	forceUpdate: function forceUpdate(callback) {
  		var $updater = this.$updater;
  		var $cache = this.$cache;
  		var props = this.props;
  		var state = this.state;
  		var context = this.context;
  		if ($updater.isPending || !$cache.isMounted) {
  			return;
  		}
  		var nextProps = $cache.props || props;
  		var nextState = $cache.state || state;
  		var nextContext = $cache.context || {};
  		var parentContext = $cache.parentContext;
  		var node = $cache.node;
  		var vnode = $cache.vnode;
  		$cache.props = $cache.state = $cache.context = null;
  		$updater.isPending = true;
  		if (this.componentWillUpdate) {
  			this.componentWillUpdate(nextProps, nextState, nextContext);
  		}
  		this.state = nextState;
  		this.props = nextProps;
  		this.context = nextContext;
  		var newVnode = renderComponent(this, parentContext);
  		var newNode = compareTwoVnodes(vnode, newVnode, node, newVnode.context);
  		if (newNode !== node) {
  			newNode.cache = newNode.cache || {};
  			syncCache(newNode.cache, node.cache, newNode);
  		}
  		$cache.vnode = newVnode;
  		$cache.node = newNode;
  		batchUpdateDOM();
  		if (this.componentDidUpdate) {
  			this.componentDidUpdate(props, state, context);
  		}
  		if (callback) {
  			callback.call(this);
  		}
  		$updater.isPending = false;
  		$updater.emitUpdate();
  	},
  	setState: function setState(nextState, callback) {
  		var $updater = this.$updater;
  		$updater.addCallback(callback);
  		$updater.addState(nextState);
  	},
  	replaceState: function replaceState(nextState, callback) {
  		var $updater = this.$updater;
  		$updater.addCallback(callback);
  		$updater.replaceState(nextState);
  	},
  	getDOMNode: function getDOMNode() {
  		var node = this.$cache.node;
  		return node && node.nodeName === '#comment' ? null : node;
  	},
  	isMounted: function isMounted() {
  		return this.$cache.isMounted;
  	}
  };
  function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
  	var shouldComponentUpdate = true;
  	if (component.shouldComponentUpdate) {
  		shouldComponentUpdate = component.shouldComponentUpdate(nextProps, nextState, nextContext);
  	}
  	if (shouldComponentUpdate === false) {
  		component.props = nextProps;
  		component.state = nextState;
  		component.context = nextContext || {};
  		return;
  	}
  	var cache = component.$cache;
  	cache.props = nextProps;
  	cache.state = nextState;
  	cache.context = nextContext || {};
  	component.forceUpdate(callback);
  }
  // event config
  var notBubbleEvents = {
  	onmouseleave: 1,
  	onmouseenter: 1,
  	onload: 1,
  	onunload: 1,
  	onscroll: 1,
  	onfocus: 1,
  	onblur: 1,
  	onrowexit: 1,
  	onbeforeunload: 1,
  	onstop: 1,
  	ondragdrop: 1,
  	ondragenter: 1,
  	ondragexit: 1,
  	ondraggesture: 1,
  	ondragover: 1,
  	oncontextmenu: 1
  };
  function getEventName(key) {
  	key = key === 'onDoubleClick' ? 'ondblclick' : key;
  	return key.toLowerCase();
  }
  // Mobile Safari does not fire properly bubble click events on
  // non-interactive elements, which means delegated click listeners do not
  // fire. The workaround for this bug involves attaching an empty click
  // listener on the target node.
  var inMobile = ('ontouchstart' in document);
  var emptyFunction = function emptyFunction() {};
  var ON_CLICK_KEY = 'onclick';
  var eventTypes = {};
  function addEvent(elem, eventType, listener) {
  	eventType = getEventName(eventType);
  	if (notBubbleEvents[eventType] === 1) {
  		elem[eventType] = listener;
  		return;
  	}
  	var eventStore = elem.eventStore || (elem.eventStore = {});
  	eventStore[eventType] = listener;
  	if (!eventTypes[eventType]) {
  		// onclick -> click
  		document.addEventListener(eventType.substr(2), dispatchEvent, false);
  		eventTypes[eventType] = true;
  	}
  	if (inMobile && eventType === ON_CLICK_KEY) {
  		elem.addEventListener('click', emptyFunction, false);
  	}
  	var nodeName = elem.nodeName;
  	if (eventType === 'onchange' && (nodeName === 'INPUT' || nodeName === 'TEXTAREA')) {
  		addEvent(elem, 'oninput', listener);
  	}
  }
  function removeEvent(elem, eventType) {
  	eventType = getEventName(eventType);
  	if (notBubbleEvents[eventType] === 1) {
  		elem[eventType] = null;
  		return;
  	}
  	var eventStore = elem.eventStore || (elem.eventStore = {});
  	delete eventStore[eventType];
  	if (inMobile && eventType === ON_CLICK_KEY) {
  		elem.removeEventListener('click', emptyFunction, false);
  	}
  	var nodeName = elem.nodeName;
  	if (eventType === 'onchange' && (nodeName === 'INPUT' || nodeName === 'TEXTAREA')) {
  		delete eventStore['oninput'];
  	}
  }
  function dispatchEvent(event) {
  	var target = event.target;
  	var type = event.type;
  	var eventType = 'on' + type;
  	var syntheticEvent = undefined;
  	updateQueue.isPending = true;
  	while (target) {
  		var _target = target;
  		var eventStore = _target.eventStore;
  		var listener = eventStore && eventStore[eventType];
  		if (!listener) {
  			target = target.parentNode;
  			continue;
  		}
  		if (!syntheticEvent) {
  			syntheticEvent = createSyntheticEvent(event);
  		}
  		syntheticEvent.currentTarget = target;
  		listener.call(target, syntheticEvent);
  		if (syntheticEvent.$cancalBubble) {
  			break;
  		}
  		target = target.parentNode;
  	}
  	updateQueue.isPending = false;
  	updateQueue.batchUpdate();
  }
  function createSyntheticEvent(nativeEvent) {
  	var syntheticEvent = {};
  	var cancalBubble = function cancalBubble() {
  		return syntheticEvent.$cancalBubble = true;
  	};
  	syntheticEvent.nativeEvent = nativeEvent;
  	for (var key in nativeEvent) {
  		if (typeof nativeEvent[key] !== 'function') {
  			syntheticEvent[key] = nativeEvent[key];
  		} else if (key === 'stopPropagation' || key === 'stopImmediatePropagation') {
  			syntheticEvent[key] = cancalBubble;
  		} else {
  			syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
  		}
  	}
  	return syntheticEvent;
  }
  function setStyle(elemStyle, styles) {
      for (var styleName in styles) {
          if (styles.hasOwnProperty(styleName)) {
              setStyleValue(elemStyle, styleName, styles[styleName]);
          }
      }
  }
  function removeStyle(elemStyle, styles) {
      for (var styleName in styles) {
          if (styles.hasOwnProperty(styleName)) {
              elemStyle[styleName] = '';
          }
      }
  }
  function patchStyle(elemStyle, style, newStyle) {
      if (style === newStyle) {
          return;
      }
      if (!newStyle && style) {
          removeStyle(elemStyle, style);
          return;
      } else if (newStyle && !style) {
          setStyle(elemStyle, newStyle);
          return;
      }
      var keyMap = {};
      for (var key in style) {
          if (style.hasOwnProperty(key)) {
              keyMap[key] = true;
              if (style[key] !== newStyle[key]) {
                  setStyleValue(elemStyle, key, newStyle[key]);
              }
          }
      }
      for (var key in newStyle) {
          if (newStyle.hasOwnProperty(key) && keyMap[key] !== true) {
              if (style[key] !== newStyle[key]) {
                  setStyleValue(elemStyle, key, newStyle[key]);
              }
          }
      }
  }
  /**
   * CSS properties which accept numbers but are not in units of "px".
   */
  var isUnitlessNumber = {
      animationIterationCount: 1,
      borderImageOutset: 1,
      borderImageSlice: 1,
      borderImageWidth: 1,
      boxFlex: 1,
      boxFlexGroup: 1,
      boxOrdinalGroup: 1,
      columnCount: 1,
      flex: 1,
      flexGrow: 1,
      flexPositive: 1,
      flexShrink: 1,
      flexNegative: 1,
      flexOrder: 1,
      gridRow: 1,
      gridColumn: 1,
      fontWeight: 1,
      lineClamp: 1,
      lineHeight: 1,
      opacity: 1,
      order: 1,
      orphans: 1,
      tabSize: 1,
      widows: 1,
      zIndex: 1,
      zoom: 1,
      // SVG-related properties
      fillOpacity: 1,
      floodOpacity: 1,
      stopOpacity: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeMiterlimit: 1,
      strokeOpacity: 1,
      strokeWidth: 1
  };
  function prefixKey(prefix, key) {
      return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  }
  var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
  Object.keys(isUnitlessNumber).forEach(function (prop) {
      prefixes.forEach(function (prefix) {
          isUnitlessNumber[prefixKey(prefix, prop)] = 1;
      });
  });
  var RE_NUMBER = /^-?\d+(\.\d+)?$/;
  function setStyleValue(elemStyle, styleName, styleValue) {
      if (!isUnitlessNumber[styleName] && RE_NUMBER.test(styleValue)) {
          elemStyle[styleName] = styleValue + 'px';
          return;
      }
      if (styleName === 'float') {
          styleName = 'cssFloat';
      }
      if (styleValue == null || typeof styleValue === 'boolean') {
          styleValue = '';
      }
      elemStyle[styleName] = styleValue;
  }
  var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
  var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\uB7\\u0300-\\u036F\\u203F-\\u2040';
  var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
  var isCustomAttribute = RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$'));
  // will merge some data in properties below
  var properties = {};
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  var MUST_USE_PROPERTY = 0x1;
  var HAS_BOOLEAN_VALUE = 0x4;
  var HAS_NUMERIC_VALUE = 0x8;
  var HAS_POSITIVE_NUMERIC_VALUE = 0x10 | 0x8;
  var HAS_OVERLOADED_BOOLEAN_VALUE = 0x20;
  // html config
  var HTMLDOMPropertyConfig = {
      props: {
          /**
           * Standard Properties
           */
          accept: 0,
          acceptCharset: 0,
          accessKey: 0,
          action: 0,
          allowFullScreen: HAS_BOOLEAN_VALUE,
          allowTransparency: 0,
          alt: 0,
          async: HAS_BOOLEAN_VALUE,
          autoComplete: 0,
          autoFocus: HAS_BOOLEAN_VALUE,
          autoPlay: HAS_BOOLEAN_VALUE,
          capture: HAS_BOOLEAN_VALUE,
          cellPadding: 0,
          cellSpacing: 0,
          charSet: 0,
          challenge: 0,
          checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          cite: 0,
          classID: 0,
          className: 0,
          cols: HAS_POSITIVE_NUMERIC_VALUE,
          colSpan: 0,
          content: 0,
          contentEditable: 0,
          contextMenu: 0,
          controls: HAS_BOOLEAN_VALUE,
          coords: 0,
          crossOrigin: 0,
          data: 0, // For `<object />` acts as `src`.
          dateTime: 0,
          'default': HAS_BOOLEAN_VALUE,
          // not in regular react, they did it in other way
          defaultValue: MUST_USE_PROPERTY,
          // not in regular react, they did it in other way
          defaultChecked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          defer: HAS_BOOLEAN_VALUE,
          dir: 0,
          disabled: HAS_BOOLEAN_VALUE,
          download: HAS_OVERLOADED_BOOLEAN_VALUE,
          draggable: 0,
          encType: 0,
          form: 0,
          formAction: 0,
          formEncType: 0,
          formMethod: 0,
          formNoValidate: HAS_BOOLEAN_VALUE,
          formTarget: 0,
          frameBorder: 0,
          headers: 0,
          height: 0,
          hidden: HAS_BOOLEAN_VALUE,
          high: 0,
          href: 0,
          hrefLang: 0,
          htmlFor: 0,
          httpEquiv: 0,
          icon: 0,
          id: 0,
          inputMode: 0,
          integrity: 0,
          is: 0,
          keyParams: 0,
          keyType: 0,
          kind: 0,
          label: 0,
          lang: 0,
          list: 0,
          loop: HAS_BOOLEAN_VALUE,
          low: 0,
          manifest: 0,
          marginHeight: 0,
          marginWidth: 0,
          max: 0,
          maxLength: 0,
          media: 0,
          mediaGroup: 0,
          method: 0,
          min: 0,
          minLength: 0,
          // Caution; `option.selected` is not updated if `select.multiple` is
          // disabled with `removeAttribute`.
          multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          name: 0,
          nonce: 0,
          noValidate: HAS_BOOLEAN_VALUE,
          open: HAS_BOOLEAN_VALUE,
          optimum: 0,
          pattern: 0,
          placeholder: 0,
          poster: 0,
          preload: 0,
          profile: 0,
          radioGroup: 0,
          readOnly: HAS_BOOLEAN_VALUE,
          rel: 0,
          required: HAS_BOOLEAN_VALUE,
          reversed: HAS_BOOLEAN_VALUE,
          role: 0,
          rows: HAS_POSITIVE_NUMERIC_VALUE,
          rowSpan: HAS_NUMERIC_VALUE,
          sandbox: 0,
          scope: 0,
          scoped: HAS_BOOLEAN_VALUE,
          scrolling: 0,
          seamless: HAS_BOOLEAN_VALUE,
          selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          shape: 0,
          size: HAS_POSITIVE_NUMERIC_VALUE,
          sizes: 0,
          span: HAS_POSITIVE_NUMERIC_VALUE,
          spellCheck: 0,
          src: 0,
          srcDoc: 0,
          srcLang: 0,
          srcSet: 0,
          start: HAS_NUMERIC_VALUE,
          step: 0,
          style: 0,
          summary: 0,
          tabIndex: 0,
          target: 0,
          title: 0,
          // Setting .type throws on non-<input> tags
          type: 0,
          useMap: 0,
          value: MUST_USE_PROPERTY,
          width: 0,
          wmode: 0,
          wrap: 0,
          /**
           * RDFa Properties
           */
          about: 0,
          datatype: 0,
          inlist: 0,
          prefix: 0,
          // property is also supported for OpenGraph in meta tags.
          property: 0,
          resource: 0,
          'typeof': 0,
          vocab: 0,
          /**
           * Non-standard Properties
           */
          // autoCapitalize and autoCorrect are supported in Mobile Safari for
          // keyboard hints.
          autoCapitalize: 0,
          autoCorrect: 0,
          // autoSave allows WebKit/Blink to persist values of input fields on page reloads
          autoSave: 0,
          // color is for Safari mask-icon link
          color: 0,
          // itemProp, itemScope, itemType are for
          // Microdata support. See http://schema.org/docs/gs.html
          itemProp: 0,
          itemScope: HAS_BOOLEAN_VALUE,
          itemType: 0,
          // itemID and itemRef are for Microdata support as well but
          // only specified in the WHATWG spec document. See
          // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
          itemID: 0,
          itemRef: 0,
          // results show looking glass icon and recent searches on input
          // search fields in WebKit/Blink
          results: 0,
          // IE-only attribute that specifies security restrictions on an iframe
          // as an alternative to the sandbox attribute on IE<10
          security: 0,
          // IE-only attribute that controls focus behavior
          unselectable: 0
      },
      attrNS: {},
      domAttrs: {
          acceptCharset: 'accept-charset',
          className: 'class',
          htmlFor: 'for',
          httpEquiv: 'http-equiv'
      },
      domProps: {}
  };
  // svg config
  var xlink = 'http://www.w3.org/1999/xlink';
  var xml = 'http://www.w3.org/XML/1998/namespace';
  // We use attributes for everything SVG so let's avoid some duplication and run
  // code instead.
  // The following are all specified in the HTML config already so we exclude here.
  // - class (as className)
  // - color
  // - height
  // - id
  // - lang
  // - max
  // - media
  // - method
  // - min
  // - name
  // - style
  // - target
  // - type
  // - width
  var ATTRS = {
      accentHeight: 'accent-height',
      accumulate: 0,
      additive: 0,
      alignmentBaseline: 'alignment-baseline',
      allowReorder: 'allowReorder',
      alphabetic: 0,
      amplitude: 0,
      arabicForm: 'arabic-form',
      ascent: 0,
      attributeName: 'attributeName',
      attributeType: 'attributeType',
      autoReverse: 'autoReverse',
      azimuth: 0,
      baseFrequency: 'baseFrequency',
      baseProfile: 'baseProfile',
      baselineShift: 'baseline-shift',
      bbox: 0,
      begin: 0,
      bias: 0,
      by: 0,
      calcMode: 'calcMode',
      capHeight: 'cap-height',
      clip: 0,
      clipPath: 'clip-path',
      clipRule: 'clip-rule',
      clipPathUnits: 'clipPathUnits',
      colorInterpolation: 'color-interpolation',
      colorInterpolationFilters: 'color-interpolation-filters',
      colorProfile: 'color-profile',
      colorRendering: 'color-rendering',
      contentScriptType: 'contentScriptType',
      contentStyleType: 'contentStyleType',
      cursor: 0,
      cx: 0,
      cy: 0,
      d: 0,
      decelerate: 0,
      descent: 0,
      diffuseConstant: 'diffuseConstant',
      direction: 0,
      display: 0,
      divisor: 0,
      dominantBaseline: 'dominant-baseline',
      dur: 0,
      dx: 0,
      dy: 0,
      edgeMode: 'edgeMode',
      elevation: 0,
      enableBackground: 'enable-background',
      end: 0,
      exponent: 0,
      externalResourcesRequired: 'externalResourcesRequired',
      fill: 0,
      fillOpacity: 'fill-opacity',
      fillRule: 'fill-rule',
      filter: 0,
      filterRes: 'filterRes',
      filterUnits: 'filterUnits',
      floodColor: 'flood-color',
      floodOpacity: 'flood-opacity',
      focusable: 0,
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontSizeAdjust: 'font-size-adjust',
      fontStretch: 'font-stretch',
      fontStyle: 'font-style',
      fontVariant: 'font-variant',
      fontWeight: 'font-weight',
      format: 0,
      from: 0,
      fx: 0,
      fy: 0,
      g1: 0,
      g2: 0,
      glyphName: 'glyph-name',
      glyphOrientationHorizontal: 'glyph-orientation-horizontal',
      glyphOrientationVertical: 'glyph-orientation-vertical',
      glyphRef: 'glyphRef',
      gradientTransform: 'gradientTransform',
      gradientUnits: 'gradientUnits',
      hanging: 0,
      horizAdvX: 'horiz-adv-x',
      horizOriginX: 'horiz-origin-x',
      ideographic: 0,
      imageRendering: 'image-rendering',
      'in': 0,
      in2: 0,
      intercept: 0,
      k: 0,
      k1: 0,
      k2: 0,
      k3: 0,
      k4: 0,
      kernelMatrix: 'kernelMatrix',
      kernelUnitLength: 'kernelUnitLength',
      kerning: 0,
      keyPoints: 'keyPoints',
      keySplines: 'keySplines',
      keyTimes: 'keyTimes',
      lengthAdjust: 'lengthAdjust',
      letterSpacing: 'letter-spacing',
      lightingColor: 'lighting-color',
      limitingConeAngle: 'limitingConeAngle',
      local: 0,
      markerEnd: 'marker-end',
      markerMid: 'marker-mid',
      markerStart: 'marker-start',
      markerHeight: 'markerHeight',
      markerUnits: 'markerUnits',
      markerWidth: 'markerWidth',
      mask: 0,
      maskContentUnits: 'maskContentUnits',
      maskUnits: 'maskUnits',
      mathematical: 0,
      mode: 0,
      numOctaves: 'numOctaves',
      offset: 0,
      opacity: 0,
      operator: 0,
      order: 0,
      orient: 0,
      orientation: 0,
      origin: 0,
      overflow: 0,
      overlinePosition: 'overline-position',
      overlineThickness: 'overline-thickness',
      paintOrder: 'paint-order',
      panose1: 'panose-1',
      pathLength: 'pathLength',
      patternContentUnits: 'patternContentUnits',
      patternTransform: 'patternTransform',
      patternUnits: 'patternUnits',
      pointerEvents: 'pointer-events',
      points: 0,
      pointsAtX: 'pointsAtX',
      pointsAtY: 'pointsAtY',
      pointsAtZ: 'pointsAtZ',
      preserveAlpha: 'preserveAlpha',
      preserveAspectRatio: 'preserveAspectRatio',
      primitiveUnits: 'primitiveUnits',
      r: 0,
      radius: 0,
      refX: 'refX',
      refY: 'refY',
      renderingIntent: 'rendering-intent',
      repeatCount: 'repeatCount',
      repeatDur: 'repeatDur',
      requiredExtensions: 'requiredExtensions',
      requiredFeatures: 'requiredFeatures',
      restart: 0,
      result: 0,
      rotate: 0,
      rx: 0,
      ry: 0,
      scale: 0,
      seed: 0,
      shapeRendering: 'shape-rendering',
      slope: 0,
      spacing: 0,
      specularConstant: 'specularConstant',
      specularExponent: 'specularExponent',
      speed: 0,
      spreadMethod: 'spreadMethod',
      startOffset: 'startOffset',
      stdDeviation: 'stdDeviation',
      stemh: 0,
      stemv: 0,
      stitchTiles: 'stitchTiles',
      stopColor: 'stop-color',
      stopOpacity: 'stop-opacity',
      strikethroughPosition: 'strikethrough-position',
      strikethroughThickness: 'strikethrough-thickness',
      string: 0,
      stroke: 0,
      strokeDasharray: 'stroke-dasharray',
      strokeDashoffset: 'stroke-dashoffset',
      strokeLinecap: 'stroke-linecap',
      strokeLinejoin: 'stroke-linejoin',
      strokeMiterlimit: 'stroke-miterlimit',
      strokeOpacity: 'stroke-opacity',
      strokeWidth: 'stroke-width',
      surfaceScale: 'surfaceScale',
      systemLanguage: 'systemLanguage',
      tableValues: 'tableValues',
      targetX: 'targetX',
      targetY: 'targetY',
      textAnchor: 'text-anchor',
      textDecoration: 'text-decoration',
      textRendering: 'text-rendering',
      textLength: 'textLength',
      to: 0,
      transform: 0,
      u1: 0,
      u2: 0,
      underlinePosition: 'underline-position',
      underlineThickness: 'underline-thickness',
      unicode: 0,
      unicodeBidi: 'unicode-bidi',
      unicodeRange: 'unicode-range',
      unitsPerEm: 'units-per-em',
      vAlphabetic: 'v-alphabetic',
      vHanging: 'v-hanging',
      vIdeographic: 'v-ideographic',
      vMathematical: 'v-mathematical',
      values: 0,
      vectorEffect: 'vector-effect',
      version: 0,
      vertAdvY: 'vert-adv-y',
      vertOriginX: 'vert-origin-x',
      vertOriginY: 'vert-origin-y',
      viewBox: 'viewBox',
      viewTarget: 'viewTarget',
      visibility: 0,
      widths: 0,
      wordSpacing: 'word-spacing',
      writingMode: 'writing-mode',
      x: 0,
      xHeight: 'x-height',
      x1: 0,
      x2: 0,
      xChannelSelector: 'xChannelSelector',
      xlinkActuate: 'xlink:actuate',
      xlinkArcrole: 'xlink:arcrole',
      xlinkHref: 'xlink:href',
      xlinkRole: 'xlink:role',
      xlinkShow: 'xlink:show',
      xlinkTitle: 'xlink:title',
      xlinkType: 'xlink:type',
      xmlBase: 'xml:base',
      xmlLang: 'xml:lang',
      xmlSpace: 'xml:space',
      y: 0,
      y1: 0,
      y2: 0,
      yChannelSelector: 'yChannelSelector',
      z: 0,
      zoomAndPan: 'zoomAndPan'
  };
  var SVGDOMPropertyConfig = {
      props: {},
      attrNS: {
          xlinkActuate: xlink,
          xlinkArcrole: xlink,
          xlinkHref: xlink,
          xlinkRole: xlink,
          xlinkShow: xlink,
          xlinkTitle: xlink,
          xlinkType: xlink,
          xmlBase: xml,
          xmlLang: xml,
          xmlSpace: xml
      },
      domAttrs: {},
      domProps: {}
  };
  Object.keys(ATTRS).map(function (key) {
      SVGDOMPropertyConfig.props[key] = 0;
      if (ATTRS[key]) {
          SVGDOMPropertyConfig.domAttrs[key] = ATTRS[key];
      }
  });
  // merge html and svg config into properties
  mergeConfigToProperties(HTMLDOMPropertyConfig);
  mergeConfigToProperties(SVGDOMPropertyConfig);
  function mergeConfigToProperties(config) {
      var
      // all react/react-lite supporting property names in here
      props = config.props;
      var
      // attributes namespace in here
      attrNS = config.attrNS;
      var
      // propName in props which should use to be dom-attribute in here
      domAttrs = config.domAttrs;
      var
      // propName in props which should use to be dom-property in here
      domProps = config.domProps;
      for (var propName in props) {
          if (!props.hasOwnProperty(propName)) {
              continue;
          }
          var propConfig = props[propName];
          properties[propName] = {
              attributeName: domAttrs.hasOwnProperty(propName) ? domAttrs[propName] : propName.toLowerCase(),
              propertyName: domProps.hasOwnProperty(propName) ? domProps[propName] : propName,
              attributeNamespace: attrNS.hasOwnProperty(propName) ? attrNS[propName] : null,
              mustUseProperty: checkMask(propConfig, MUST_USE_PROPERTY),
              hasBooleanValue: checkMask(propConfig, HAS_BOOLEAN_VALUE),
              hasNumericValue: checkMask(propConfig, HAS_NUMERIC_VALUE),
              hasPositiveNumericValue: checkMask(propConfig, HAS_POSITIVE_NUMERIC_VALUE),
              hasOverloadedBooleanValue: checkMask(propConfig, HAS_OVERLOADED_BOOLEAN_VALUE)
          };
      }
  }
  function checkMask(value, bitmask) {
      return (value & bitmask) === bitmask;
  }
  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  function setPropValue(node, name, value) {
      var propInfo = properties.hasOwnProperty(name) && properties[name];
      if (propInfo) {
          // should delete value from dom
          if (value == null || propInfo.hasBooleanValue && !value || propInfo.hasNumericValue && isNaN(value) || propInfo.hasPositiveNumericValue && value < 1 || propInfo.hasOverloadedBooleanValue && value === false) {
              removePropValue(node, name);
          } else if (propInfo.mustUseProperty) {
              var propName = propInfo.propertyName;
              // dom.value has side effect
              if (propName !== 'value' || '' + node[propName] !== '' + value) {
                  node[propName] = value;
              }
          } else {
              var attributeName = propInfo.attributeName;
              var namespace = propInfo.attributeNamespace;
              // `setAttribute` with objects becomes only `[object]` in IE8/9,
              // ('' + value) makes it output the correct toString()-value.
              if (namespace) {
                  node.setAttributeNS(namespace, attributeName, '' + value);
              } else if (propInfo.hasBooleanValue || propInfo.hasOverloadedBooleanValue && value === true) {
                  node.setAttribute(attributeName, '');
              } else {
                  node.setAttribute(attributeName, '' + value);
              }
          }
      } else if (isCustomAttribute(name) && VALID_ATTRIBUTE_NAME_REGEX.test(name)) {
          if (value == null) {
              node.removeAttribute(name);
          } else {
              node.setAttribute(name, '' + value);
          }
      }
  }
  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  function removePropValue(node, name) {
      var propInfo = properties.hasOwnProperty(name) && properties[name];
      if (propInfo) {
          if (propInfo.mustUseProperty) {
              var propName = propInfo.propertyName;
              if (propInfo.hasBooleanValue) {
                  node[propName] = false;
              } else {
                  // dom.value accept string value has side effect
                  if (propName !== 'value' || '' + node[propName] !== '') {
                      node[propName] = '';
                  }
              }
          } else {
              node.removeAttribute(propInfo.attributeName);
          }
      } else if (isCustomAttribute(name)) {
          node.removeAttribute(name);
      }
  }
  function isFn(obj) {
      return typeof obj === 'function';
  }
  var isArr = Array.isArray;
  function noop() {}
  function identity(obj) {
      return obj;
  }
  function pipe(fn1, fn2) {
      return function () {
          fn1.apply(this, arguments);
          return fn2.apply(this, arguments);
      };
  }
  function flattenChildren(list, iteratee, a) {
      var len = list.length;
      var i = -1;
      while (len--) {
          var item = list[++i];
          if (isArr(item)) {
              flattenChildren(item, iteratee, a);
          } else {
              iteratee(item, a);
          }
      }
  }
  function eachItem(list, iteratee) {
      for (var i = 0, len = list.length; i < len; i++) {
          iteratee(list[i], i);
      }
  }
  function extend(to, from) {
      if (!from) {
          return to;
      }
      var keys = Object.keys(from);
      var i = keys.length;
      while (i--) {
          to[keys[i]] = from[keys[i]];
      }
      return to;
  }
  var uid = 0;
  function getUid() {
      return ++uid;
  }
  var EVENT_KEYS = /^on/i;
  function setProps(elem, props, isCustomComponent) {
      for (var key in props) {
          if (!props.hasOwnProperty(key) || key === 'children') {
              continue;
          }
          var value = props[key];
          if (EVENT_KEYS.test(key)) {
              addEvent(elem, key, value);
          } else if (key === 'style') {
              setStyle(elem.style, value);
          } else if (key === 'dangerouslySetInnerHTML') {
              value && value.__html != null && (elem.innerHTML = value.__html);
          } else if (isCustomComponent) {
              if (value == null) {
                  elem.removeAttribute(key);
              } else {
                  elem.setAttribute(key, '' + value);
              }
          } else {
              setPropValue(elem, key, value);
          }
      }
  }
  function patchProp(key, oldValue, value, elem, isCustomComponent) {
      if (key === 'value' || key === 'checked') {
          oldValue = elem[key];
      }
      if (value === oldValue) {
          return;
      }
      if (value === undefined) {
          if (EVENT_KEYS.test(key)) {
              removeEvent(elem, key);
          } else if (key === 'style') {
              removeStyle(elem.style, oldValue);
          } else if (key === 'dangerouslySetInnerHTML') {
              elem.innerHTML = '';
          } else if (isCustomComponent) {
              elem.removeAttribute(key);
          } else {
              removePropValue(elem, key);
          }
          return;
      }
      if (EVENT_KEYS.test(key)) {
          // addEvent will replace the oldValue
          addEvent(elem, key, value);
      } else if (key === 'style') {
          patchStyle(elem.style, oldValue, value);
      } else if (key === 'dangerouslySetInnerHTML') {
          var oldHtml = oldValue && oldValue.__html;
          var html = value && value.__html;
          if (html != null && html !== oldHtml) {
              elem.innerHTML = html;
          }
      } else if (isCustomComponent) {
          if (value == null) {
              elem.removeAttribute(key);
          } else {
              elem.setAttribute(key, '' + value);
          }
      } else {
          setPropValue(elem, key, value);
      }
  }
  function patchProps(elem, props, newProps, isCustomComponent) {
      var keyMap = { children: true };
      for (var key in props) {
          if (props.hasOwnProperty(key) && key !== 'children') {
              keyMap[key] = true;
              patchProp(key, props[key], newProps[key], elem, isCustomComponent);
          }
      }
      for (var key in newProps) {
          if (newProps.hasOwnProperty(key) && keyMap[key] !== true) {
              patchProp(key, props[key], newProps[key], elem, isCustomComponent);
          }
      }
  }
  if (!Object.freeze) {
      Object.freeze = identity;
  }
  var pendingRendering = {};
  var vnodeStore = {};
  function renderTreeIntoContainer(vnode, container, callback, parentContext) {
  	if (!vnode.vtype) {
  		throw new Error('cannot render ' + vnode + ' to container');
  	}
  	var id = container[COMPONENT_ID] || (container[COMPONENT_ID] = getUid());
  	var argsCache = pendingRendering[id];
  	// component lify cycle method maybe call root rendering
  	// should bundle them and render by only one time
  	if (argsCache) {
  		if (argsCache === true) {
  			pendingRendering[id] = argsCache = [vnode, callback, parentContext];
  		} else {
  			argsCache[0] = vnode;
  			argsCache[2] = parentContext;
  			if (callback) {
  				argsCache[1] = argsCache[1] ? pipe(argsCache[1], callback) : callback;
  			}
  		}
  		return;
  	}
  	pendingRendering[id] = true;
  	var oldVnode = null;
  	var rootNode = null;
  	if (oldVnode = vnodeStore[id]) {
  		rootNode = compareTwoVnodes(oldVnode, vnode, container.firstChild, parentContext);
  	} else {
  		rootNode = initVnode(vnode, parentContext, container.namespaceURI);
  		var childNode = null;
  		while (childNode = container.lastChild) {
  			container.removeChild(childNode);
  		}
  		container.appendChild(rootNode);
  	}
  	vnodeStore[id] = vnode;
  	var isPending = updateQueue.isPending;
  	updateQueue.isPending = true;
  	batchUpdateDOM();
  	argsCache = pendingRendering[id];
  	delete pendingRendering[id];
  	var result = null;
  	if (isArr(argsCache)) {
  		result = renderTreeIntoContainer(argsCache[0], container, argsCache[1], argsCache[2]);
  	} else if (vnode.vtype === VELEMENT) {
  		result = rootNode;
  	} else if (vnode.vtype === VCOMPONENT) {
  		result = rootNode.cache[vnode.id];
  	}
  	if (!isPending) {
  		updateQueue.isPending = false;
  		updateQueue.batchUpdate();
  	}
  	if (callback) {
  		callback.call(result);
  	}
  	return result;
  }
  function render(vnode, container, callback) {
  	return renderTreeIntoContainer(vnode, container, callback);
  }
  function unstable_renderSubtreeIntoContainer(parentComponent, subVnode, container, callback) {
  	var context = parentComponent.vnode ? parentComponent.vnode.context : parentComponent.$cache.parentContext;
  	return renderTreeIntoContainer(subVnode, container, callback, context);
  }
  function unmountComponentAtNode(container) {
  	if (!container.nodeName) {
  		throw new Error('expect node');
  	}
  	var id = container[COMPONENT_ID];
  	var vnode = null;
  	if (vnode = vnodeStore[id]) {
  		destroyVnode(vnode, container.firstChild);
  		container.removeChild(container.firstChild);
  		delete vnodeStore[id];
  		return true;
  	}
  	return false;
  }
  function findDOMNode(node) {
  	if (node == null) {
  		return null;
  	}
  	if (node.nodeName) {
  		return node;
  	}
  	var component = node;
  	// if component.node equal to false, component must be unmounted
  	if (component.getDOMNode && component.$cache.isMounted) {
  		return component.getDOMNode();
  	}
  	throw new Error('findDOMNode can not find Node');
  }
  var ReactDOM = Object.freeze({
  	render: render,
  	unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
  	unmountComponentAtNode: unmountComponentAtNode,
  	findDOMNode: findDOMNode
  });
  function isValidElement(obj) {
  	return obj != null && !!obj.vtype;
  }
  function cloneElement(originElem, props) {
  	var type = originElem.type;
  	var key = originElem.key;
  	var ref = originElem.ref;
  	var newProps = extend(extend({ key: key, ref: ref }, originElem.props), props);
  	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
  		children[_key - 2] = arguments[_key];
  	}
  	var vnode = createElement.apply(undefined, [type, newProps].concat(children));
  	if (vnode.ref === originElem.ref) {
  		vnode.refs = originElem.refs;
  	}
  	return vnode;
  }
  function createFactory(type) {
  	var factory = function factory() {
  		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  			args[_key2] = arguments[_key2];
  		}
  		return createElement.apply(undefined, [type].concat(args));
  	};
  	factory.type = type;
  	return factory;
  }
  function createElement(type, props, children) {
  	var createVnode = null;
  	var varType = typeof type;
  	if (varType === 'string') {
  		createVnode = createVelem;
  	} else if (varType === 'function') {
  		if (type.prototype && typeof type.prototype.forceUpdate === 'function') {
  			createVnode = createVcomponent;
  		} else {
  			createVnode = createVstateless;
  		}
  	} else {
  		throw new Error('React.createElement: unexpect type [ ' + type + ' ]');
  	}
  	var key = null;
  	var ref = null;
  	var finalProps = {};
  	if (props != null) {
  		for (var propKey in props) {
  			if (!props.hasOwnProperty(propKey)) {
  				continue;
  			}
  			if (propKey === 'key') {
  				if (props.key !== undefined) {
  					key = '' + props.key;
  				}
  			} else if (propKey === 'ref') {
  				if (props.ref !== undefined) {
  					ref = props.ref;
  				}
  			} else {
  				finalProps[propKey] = props[propKey];
  			}
  		}
  	}
  	var defaultProps = type.defaultProps;
  	if (defaultProps) {
  		for (var propKey in defaultProps) {
  			if (finalProps[propKey] === undefined) {
  				finalProps[propKey] = defaultProps[propKey];
  			}
  		}
  	}
  	var argsLen = arguments.length;
  	var finalChildren = children;
  	if (argsLen > 3) {
  		finalChildren = Array(argsLen - 2);
  		for (var i = 2; i < argsLen; i++) {
  			finalChildren[i - 2] = arguments[i];
  		}
  	}
  	if (finalChildren !== undefined) {
  		finalProps.children = finalChildren;
  	}
  	var vnode = createVnode(type, finalProps);
  	vnode.key = key;
  	vnode.ref = ref;
  	return vnode;
  }
  var tagNames = 'a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|circle|clipPath|defs|ellipse|g|image|line|linearGradient|mask|path|pattern|polygon|polyline|radialGradient|rect|stop|svg|text|tspan';
  var DOM = {};
  eachItem(tagNames.split('|'), function (tagName) {
  	DOM[tagName] = createFactory(tagName);
  });
  var check = function check() {
      return check;
  };
  check.isRequired = check;
  var PropTypes = {
      "array": check,
      "bool": check,
      "func": check,
      "number": check,
      "object": check,
      "string": check,
      "any": check,
      "arrayOf": check,
      "element": check,
      "instanceOf": check,
      "node": check,
      "objectOf": check,
      "oneOf": check,
      "oneOfType": check,
      "shape": check
  };
  function only(children) {
  	if (isValidElement(children)) {
  		return children;
  	}
  	throw new Error('expect only one child');
  }
  function forEach(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var index = 0;
  	if (isArr(children)) {
  		flattenChildren(children, function (child) {
  			iteratee.call(context, child, index++);
  		});
  	} else {
  		iteratee.call(context, children, index);
  	}
  }
  function map(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var store = [];
  	var keyMap = {};
  	forEach(children, function (child, index) {
  		var data = {};
  		data.child = iteratee.call(context, child, index) || child;
  		data.isEqual = data.child === child;
  		var key = data.key = getKey(child, index);
  		if (keyMap.hasOwnProperty(key)) {
  			keyMap[key] += 1;
  		} else {
  			keyMap[key] = 0;
  		}
  		data.index = keyMap[key];
  		store.push(data);
  	});
  	var result = [];
  	eachItem(store, function (_ref) {
  		var child = _ref.child;
  		var key = _ref.key;
  		var index = _ref.index;
  		var isEqual = _ref.isEqual;
  		if (child == null || typeof child === 'boolean') {
  			return;
  		}
  		if (!isValidElement(child) || key == null) {
  			result.push(child);
  			return;
  		}
  		if (keyMap[key] !== 0) {
  			key += ':' + index;
  		}
  		if (!isEqual) {
  			key = escapeUserProvidedKey(child.key || '') + '/' + key;
  		}
  		child = cloneElement(child, { key: key });
  		result.push(child);
  	});
  	return result;
  }
  function count(children) {
  	var count = 0;
  	forEach(children, function () {
  		count++;
  	});
  	return count;
  }
  function toArray(children) {
  	return map(children, identity) || [];
  }
  function getKey(child, index) {
  	var key = undefined;
  	if (isValidElement(child) && typeof child.key === 'string') {
  		key = '.$' + child.key;
  	} else {
  		key = '.' + index.toString(36);
  	}
  	return key;
  }
  var userProvidedKeyEscapeRegex = /\/(?!\/)/g;
  function escapeUserProvidedKey(text) {
  	return ('' + text).replace(userProvidedKeyEscapeRegex, '//');
  }
  var Children = Object.freeze({
  	only: only,
  	forEach: forEach,
  	map: map,
  	count: count,
  	toArray: toArray
  });
  function eachMixin(mixins, iteratee) {
  	eachItem(mixins, function (mixin) {
  		if (mixin) {
  			if (isArr(mixin.mixins)) {
  				eachMixin(mixin.mixins, iteratee);
  			}
  			iteratee(mixin);
  		}
  	});
  }
  function combineMixinToProto(proto, mixin) {
  	for (var key in mixin) {
  		if (!mixin.hasOwnProperty(key)) {
  			continue;
  		}
  		var value = mixin[key];
  		if (key === 'getInitialState') {
  			proto.$getInitialStates.push(value);
  			continue;
  		}
  		var curValue = proto[key];
  		if (isFn(curValue) && isFn(value)) {
  			proto[key] = pipe(curValue, value);
  		} else {
  			proto[key] = value;
  		}
  	}
  }
  function combineMixinToClass(Component, mixin) {
  	extend(Component.propTypes, mixin.propTypes);
  	extend(Component.contextTypes, mixin.contextTypes);
  	extend(Component, mixin.statics);
  	if (isFn(mixin.getDefaultProps)) {
  		extend(Component.defaultProps, mixin.getDefaultProps());
  	}
  }
  function bindContext(obj, source) {
  	for (var key in source) {
  		if (source.hasOwnProperty(key)) {
  			if (isFn(source[key])) {
  				obj[key] = source[key].bind(obj);
  			}
  		}
  	}
  }
  var Facade = function Facade() {};
  Facade.prototype = Component.prototype;
  function getInitialState() {
  	var _this = this;
  	var state = {};
  	var setState = this.setState;
  	this.setState = Facade;
  	eachItem(this.$getInitialStates, function (getInitialState) {
  		if (isFn(getInitialState)) {
  			extend(state, getInitialState.call(_this));
  		}
  	});
  	this.setState = setState;
  	return state;
  }
  function createClass(spec) {
  	if (!isFn(spec.render)) {
  		throw new Error('createClass: spec.render is not function');
  	}
  	var specMixins = spec.mixins || [];
  	var mixins = specMixins.concat(spec);
  	spec.mixins = null;
  	function Klass(props, context) {
  		Component.call(this, props, context);
  		this.constructor = Klass;
  		spec.autobind !== false && bindContext(this, Klass.prototype);
  		this.state = this.getInitialState() || this.state;
  	}
  	Klass.displayName = spec.displayName;
  	Klass.contextTypes = {};
  	Klass.propTypes = {};
  	Klass.defaultProps = {};
  	var proto = Klass.prototype = new Facade();
  	proto.$getInitialStates = [];
  	eachMixin(mixins, function (mixin) {
  		combineMixinToProto(proto, mixin);
  		combineMixinToClass(Klass, mixin);
  	});
  	proto.getInitialState = getInitialState;
  	spec.mixins = specMixins;
  	return Klass;
  }
  var React = extend({
      version: '0.15.1',
      cloneElement: cloneElement,
      isValidElement: isValidElement,
      createElement: createElement,
      createFactory: createFactory,
      Component: Component,
      createClass: createClass,
      Children: Children,
      PropTypes: PropTypes,
      DOM: DOM
  }, ReactDOM);
  React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOM;
  return React;
}));
;
 (function(f) {
         var g;
         if (typeof window !== "undefined") {
             g = window;
         } else if (typeof global !== "undefined") {
             g = global;
         } else if (typeof self !== "undefined") {
             g = self;
         } else {
             // works providing we're not in "use strict";
             // needed for Java 8 Nashorn
             // see https://github.com/facebook/react/issues/3037
             g = this;
         }
         g.ReactDOM = f(g.React);
 })(function(React) {
     return React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
 });/**
  * ReactDOM v15.0.0-rc.2
  *
  * Copyright 2013-present, Facebook, Inc.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree. An additional grant
  * of patent rights can be found in the PATENTS file in the same directory.
  *
  */
 // Based off https://github.com/ForbesLindesay/umd/blob/master/template.js
 ;
 (function(f) {
         var g;
         if (typeof window !== "undefined") {
             g = window;
         } else if (typeof global !== "undefined") {
             g = global;
         } else if (typeof self !== "undefined") {
             g = self;
         } else {
             // works providing we're not in "use strict";
             // needed for Java 8 Nashorn
             // see https://github.com/facebook/react/issues/3037
             g = this;
         }
         g.ReactDOM = f(g.React);
 })(function(React) {
     return React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
 });
