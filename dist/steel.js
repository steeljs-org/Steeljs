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
        throw 'parseURL:"' + url + '" is wrong!';
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
        origin = location.origin;
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
var resource_define_apiRule;
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
	var args = [].slice.call(arguments, 1);
	for ( var i = typeArray.length - 1; i > -1; i-- ) {
		try {
			typeArray[ i ] && typeArray[ i ].apply( undefined, args );
		} catch ( e ) {
			type != logNotice && core_notice_trigger( logNotice, ['[error][notice][' + type + ']', e] );
		}
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
    return core_object_isObject(history.state) ? history.state : {};
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
// var render_base_stage_usable = false;
//内存级：是否在浏览器中内存缓存启用了场景的页面内容，缓存后页面将由开发者主动刷新
var render_base_stageCache_usable = false;
//是否支持场景切换
var render_base_stageChange_usable = false;
//场景默认显示内容
var render_base_stageDefaultHTML = '';
////
//是否启用进度条
var render_base_loadingBar_usable = false;
//boxid生成器 当参数为true时要求：1.必须唯一 2.同一页面同一模块的id必须是固定的
function render_base_idMaker(supId) {
    return core_uniqueKey();
}/*
 * 把类数组改变成数组
 * @method core_array_makeArray
 * @private
 * @param {arrayLike} obj
 *	需要查找的对象
 * @return {Array} 
 */
function core_array_makeArray( obj ) {
	try {
		return [].slice.call(obj);
	} catch (e) { //for IE
		var j, i = 0, rs = [];
		while ( j = obj[i] ){
			rs[i++] = j;
		}
		return rs;
	}
}
function render_error() {
	log(arguments);
    core_notice_trigger.apply(undefined, ['renderError'].concat(core_array_makeArray(arguments)));
}/*
 * control核心逻辑
 *//*
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
            require_global(logic, cb, render_error, controllerNs);
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
                log('Error: run logic error:', resContainer.logic, e);
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
}/**
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
var render_stage_data = {}; //stageBoxId -> {curr:index, last:index, subs:[]}
var render_stage_anidata = {};
var render_stage_style_mainId = 'steel-style-main';
var render_stage_style_rewriteId = 'steel-style-rewrite';
var render_stage_ani_transition_class = 'steel-stage-transform';
var render_stage_scroll_class = 'steel-render-stage-scroll';
var render_stage_fixed_class = 'steel-render-stage-fixed';
var render_stage_subNode_class = 'steel-stage-sub';
var render_stage_subNode_className = render_stage_subNode_class;
var render_stage_subNode_transition_className = render_stage_ani_transition_class + ' ' + render_stage_subNode_class;
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
                core_dom_setAttribute(currNode, 'class', render_stage_subNode_transition_className);
                core_dom_setAttribute(lastNode, 'class', render_stage_subNode_transition_className);
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
                core_dom_setAttribute(currNode, 'class', render_stage_subNode_className);
                core_dom_setAttribute(lastNode, 'class', render_stage_subNode_className);
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
                            throw e;
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
    core_dom_setAttribute(subNode, 'class', render_stage_subNode_className);
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
    var styleTextArray = [];
    if (render_base_stageChange_usable) {
        styleTextArray.push('body{overflow:hidden;-webkit-overflow-scrolling : touch;}');//
        styleTextArray.push('.' + render_stage_ani_transition_class + '{-webkit-transition: -webkit-transform 0.4s ease-out;transition: transform 0.4s ease-out;}');
        styleTextArray.push('.' + render_stage_subNode_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;}');
        styleTextArray.push('.' + render_stage_scroll_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;-webkit-box-sizing : border-box;}');
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
            's-id': render_base_idMaker(),
        });
    }
    return result;
}/*
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
        throw 'The method "steel.setExtTplData(obj)" used in your app need an object as the param.';
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
    var boxId = resContainer.boxId;
    if (!resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
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
}/**
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
    var controllerNs = render_base_controllerNs[boxId];
    var css = core_nameSpaceFix(resContainer.css, controllerNs);
    if (render_control_setCss_cssCache[css]) {
        render_control_setCss_cssCache[css][boxId] = true;
        cssReady();
        return;
    }
    render_control_setCss_cssCache[css] = {};
    render_control_setCss_cssCache[css][boxId] = true;
    var cb = cssCallbackFn = function(){
        if(cb === cssCallbackFn) {
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
    css && resource_res.css(css, cb, function() {
        log('Error: css("' + css + '" load error!');
        cssReady();
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
        require_global(tpl, cb, render_error, controllerNs);
    }
}
function render_control_setTpl_toRender(resContainer) {
    resContainer.tplReady = true;
    render_control_render(resContainer);
}//http://www.sharejs.com/codes/javascript/1985
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
var render_control_main_types = ['css', 'tpl', 'data', 'logic'];
var render_control_main_realTypeMap = {
    tpl: 'tplFn',
    data: 'real_data',
    logic: 'logicFn'
};
var render_control_main_eventList = ['init', 'enter', 'leave', 'destroy'];
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
    //状态类型 newset|loading|ready
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned
    var changeResList = {};
    var control = {
        id: boxId,
        setForceRender: function(_forceRender) {
            resContainer.forceRender = _forceRender;
        },
        get: function(url, type) {
            var result = '';
            /*if(type === 'tpl'){}*/
            return result;
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
                    // if (render_control_main_realTypeMap[type] && render_control_main_realTypeMap[type] in resContainer) {
                    //     delete resContainer[render_control_main_realTypeMap[type]];
                    // }
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
    function deal() {
        resContainer.lastRes = null;
        var tplChanged = changeResList['tpl'];
        var dataChanged = changeResList['data'];
        var cssChanged = changeResList['css'];
        var logicChanged = changeResList['logic'];
        resContainer.childrenChanged = changeResList['children'];
        changeResList = {};
        if (tplChanged || dataChanged) {
            resContainer.rendered = false;
            resContainer.html = '';
            resContainer.toDestroyChildrenid = core_object_clone(resContainer.childrenid);
        } else {
            render_contorl_toTiggerChildren(resContainer);
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
    if (isMain) {
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
        control.deal();
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
        var href = location.href;
        if (popstateTime === 0 && router_base_currentHref === href) {
            return;
        }
        router_listen_handleHrefChenged(href);
    });
    setTimeout(function() {
        popstateTime = 1;
    }, 1000);
    //popstate 事件在第一次被绑定时也会触发，但不是100%，所以加了个延时
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
            url && location.replace(core_fixUrl(router_router_get().url, url));
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
    var index = router_history_getStateIndex();
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
        url = url.charAt(0) === '/' ? url.slice(1) : url;
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
        try {
            item[access](data, url);
        } catch(e) {
            core_asyncCall(function(item) {
                item[1](data, url);
            }, [item]);
        }
    }
}
function resource_queue_del(url) {
    url in resource_queue_list && (delete resource_queue_list[url]);
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
    var link = core_dom_createElement('link');
    var load_div = null;
    var domID = core_uniqueKey();
    var timer = null;
    var _rTime = 500;//5000毫秒
    core_dom_setAttribute(link, 'rel', 'Stylesheet');
    core_dom_setAttribute(link, 'type', 'text/css');
    core_dom_setAttribute(link, 'charset', 'utf-8');
    core_dom_setAttribute(link, 'id', 'link_' + load_ID);
    core_dom_setAttribute(link, 'href', url);
    head.appendChild(link);
    load_div = core_dom_createElement('div');
    core_dom_setAttribute(load_div, 'id', load_ID);
    core_hideDiv_appendChild(load_div);
    timer = function() {
        if (parseInt(window.getComputedStyle ? getComputedStyle(load_div, null)['height'] : load_div.currentStyle && load_div.currentStyle['height']) === 42) {
            core_hideDiv_removeChild(load_div);
            callback(true);
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
}
function loader_css_remove(load_ID) {
    var linkDom = getElementById('link_' + load_ID);
    if (linkDom) {
        core_dom_removeNode(linkDom);
        return true;
    }
    return false;
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
function loader_ajax(url, onComplete){//(url, callback)
    var opts = {
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'onComplete': onComplete || emptyFunction,
        'onTimeout': emptyFunction,
        'uniqueID': null,
        'onFail': emptyFunction,
        'method': 'get', // post or get
        'asynchronous': true,
        'header' : {},
        'isEncode' : false,
        'responseType': 'json'// xml or text or json
    };
    if (url == '') {
        throw 'ajax need url in parameters object';
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
    var apiRule = resource_define_apiRule || onComplete;
    function onComplete(req, params, callback) {
        if (req && req.code == '100000') {
            callback(true, req);
        }else {
            log('Error: res data url("' + url + '") : The api error code is ' + (req && req.code) + '. The error reason is ' + (req && req.msg));
            callback(false, req, params);
        }
    }
    return loader_ajax(url, function(req, params) {
        apiRule(req, params, callback);
    });
}
var resource_res_cssPrefix = 'S_CSS_';
var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle('js', name, succ, err);
    },
    css: function(name, succ, err) {
        resource_res_handle('css', name, succ, err, resource_res_getCssId(name));
    },
    get: function(name, succ, err) {
        resource_res_handle('ajax', name, succ, err);
    },
    removeCss: function(name) {
        return loader_css_remove(resource_res_getCssId(name));
    }
};
function resource_res_handle(type, name, succ, err, cssId) {
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
                var runner_result;
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
            throw 'Error: ns("' + ns + '") is undefined!';
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
    resource_define_apiRule = parseParamFn('defApiRule', resource_define_apiRule);
    resource_base_version = parseParamFn('version', resource_base_version);
});
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
            // render_base_stage_usable = parseParamFn('stage', render_base_stage_usable);
            // if (render_base_stage_usable) {
                render_base_stageCache_usable = parseParamFn('stageCache', render_base_stageCache_usable);
                render_base_stageChange_usable = parseParamFn('stageChange', render_base_stageChange_usable);
                render_base_stageDefaultHTML = parseParamFn('stageDefaultHTML', render_base_stageDefaultHTML);
                render_base_stage_maxLength = parseParamFn('stageMaxLength', render_base_stage_maxLength);
            // }
        }
    }
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