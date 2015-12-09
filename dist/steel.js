/**
 * WebApp
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
 

var config_list = [];

steel.config = function(config) {
  var parseParamFn = config_parseParamFn(config);
  for (var i = 0, l = config_list.length; i < l; ++i) {
    config_list[i](parseParamFn, config);
  }
};

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
var require_global_loadingNum = 0;

function require_base_idFix(id, basePath) {
    if (id.indexOf('.') === 0) {
        id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
    }
    while (id.indexOf('../') !== -1) {
        id = id.replace(/\w+\/\.\.\//, '');
    }
    return id;
}

function require_base_nameToPath(name){
    return name.substr(0, name.lastIndexOf('/') + 1);
}/*
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
    retJson.path = retJson.path || '/';
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
	
}
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
};

/**
 * 资源变量
 */
var resource_jsPath;
var resource_cssPath;
var resource_ajaxPath;
var resource_basePath;
var resource_define_apiRule;

//资源列表{url->[[access_cb, fail_cb],....]}
var resource_queue_list = {};
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

    if (/^([a-z]+:)?\/\/\w+/i.test(path)) {
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
    if (/^\?/.test(path)) {
        return origin + baseUrlJson.path + path;
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
}//router资源
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
}
/*
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
		spliceLength = 0;
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
 * @param {Array} args
 */
function core_notice_trigger( type, args ) {
	var typeArray = core_notice_find( type );
	args = [].concat( args || [] );
	for ( var i = typeArray.length - 1; i > -1; i-- ) {
		try {
			typeArray[ i ] && typeArray[ i ].apply( undefined, args );
		} catch ( e ) {
			type != logNotice && core_notice_trigger( logNotice, ['[error][notice][' + type + ']', e] );
		}
	}
}
/**
 * 路由变量定义区
 *
 */
//收集用户路由配置信息
var router_base_routerTable = [];

//处理后的路由集合，[{pathRegexp:RegExp, controller:'controllerFn', keys:{}}]
var router_base_routerTableReg = [];

//项目是否使用hash
var router_base_useHash = false;

//应用是否支持单页面（跳转与否），默认应用是单页面
var router_base_singlePage = true;

//当前访问path的变量集合,以及location相关的解析结果
var router_base_params;
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
	function( el, type, fn ) {
		el.addEventListener( type, fn, false );
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
	
}
/*
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
/**
 * 生成路由结果
 */


var router_makeParams_hasStrip = /^#*/;
function router_makeParams(url) {
    var parseUrl = core_parseURL(url);
    var subHref;
    var params;
    var path;

    if (router_base_useHash) {
        //获取当前 hash后的 path
        subHref = parseUrl.hash.replace(router_makeParams_hasStrip, '');
        params = core_fixUrl(url, subHref);
    } else {
        params = parseUrl;
    }
    path = params.path;
    params.path = isDebug ? path.replace(/\.(jade)$/g, '') : path;
    params.search = params.query;
    params.query = core_queryToJson(params.query);
    params.type = router_base_routerType;
    params.prev = router_base_prevHref;

    return params;
}


//匹配路由表，返回匹配的controller
// @Finrila 没有用到的方法代码
// function router_match_bak(url) {
//     url = url || location.toString();
//     var parsePath = core_parseURL(url).path.replace(/\/+/g, '/');
//     parsePath = isDebug ? parsePath.replace(/\.(jade|html)$/g, '') : parsePath;
//     for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
//         if (router_match_urlFix(router_base_routerTable[i][0]) === router_match_urlFix(parsePath)) {
//             return router_base_routerTable[i][1];
//         }
//     }
//     return false;
// }

function router_match(url) {
    url = url || location.toString();
    var routerParams = router_makeParams(url);
    var path = routerParams.path;// store values
    var m = [];//正则校验结果；

    for (var i = 0, len = router_base_routerTableReg.length; i < len; i++) {
        var obj = router_base_routerTableReg[i];
        if ((m = obj['pathRegexp'].exec(path))) {
            var keys = obj['keys'];
            var params = routerParams.params;
            var prop;
            var n = 0;
            var key;
            var val;

            for (var j = 1, len = m.length; j < len; ++j) {
                key = keys[j - 1];
                prop = key
                    ? key.name
                    : n++;
                val = router_match_decodeParam(m[j]);

                if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
                    params[prop] = val;
                }
            }
            return obj['controller'];
        }
    }

    return false;
}

function router_match_decodeParam(val) {
    if (typeof val !== 'string') {
        return val;
    }

    try {
        return decodeURIComponent(val);
    } catch (e) {
        throw new Error("Failed to decode param '" + val + "'");
    }
}

/*
//最后一个不区分大小写 例如"/v1/public/h5/custommenu/main" 与 "/v1/public/h5/custommenu/mAiN"
function router_match_urlFix(url) {
	var res = url.slice(url.lastIndexOf('/') + 1);
	return url.replace(res, res.toLowerCase());
}*//**
 * 公共对象方法定义文件
 */

//control容器
var render_base_controlCache = {};
//controllerNs容器
var render_base_controllerNs = {};
//资源容器
var render_base_resContainer = {};
//render数量
var render_base_count = 0;

//id生成器
function render_base_idMaker(){
    return core_uniqueKey();
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
    core_notice_trigger('renderError', core_array_makeArray(arguments));
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
	node && node.parentNode.removeChild( node );
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
    childrenid = childrenid || {};
    for (var id in childrenid) {
        var childResContainer = render_base_resContainer[id];
        var childControl = render_base_controlCache[id];
        var childControllerNs = render_base_controllerNs[id];
        if (childControl) {
            childControl._destroy();
            delete render_base_controlCache[id];
        }

        if (childControllerNs) {
            delete render_base_controllerNs[id];
        }
        
        if (childResContainer) {
            render_control_destroyChildren(childResContainer.childrenid);
            if (childResContainer.logicResult) {
              childResContainer.logicResult.destroy && childResContainer.logicResult.destroy();
              delete childResContainer.logicResult;
            }
            delete render_base_resContainer[id];
        }
    }
    
}/**
 * @param {Object} o
 * @param {boolean} isprototype 继承的属性是否也在检查之列
 * @example
 * core_obj_isEmpty({}) === true;
 * core_obj_isEmpty({'test':'test'}) === false;
 */
function core_obj_isEmpty(o,isprototype){
    for(var k in o){
        if(isprototype || o.hasOwnProperty(k)){
            return false;
        }
    }
    return true;
}

function core_array_inArray(oElement, aSource){
    return core_array_indexOf(oElement, aSource) > -1;
}

//解析jade fun
function render_parse(jadeFunStr){
    var g;
    var result = [];
    var ret = [];
    var reg = /<[a-z]+([^>]*?s-(child)[^>]*?)>/g;//|tpl|data|css|logic
    
    while (g = reg.exec(jadeFunStr)){
        var ele = g[1].replace(/\\\"/g, '"');
        var oEle = ele.replace(/\"/g, '').replace(/ /g, '&');
        var eleObj = core_queryToJson(oEle);
        var id = render_base_idMaker();
        
        eleObj['s-id'] = id;
        eleObj['s-all'] = ele;
        result.push(eleObj);
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
                    endTime = new Date;
                    core_notice_trigger('logicTime', {
                        startTime: startTime,
                        logicTime: endTime - startTime || 0,
                        ctrlNS: controllerNs
                    });
                    fn && (resContainer.logicFn = fn);
                    render_control_toStartLogic(resContainer);
                }
                //抛出js加载完成事件
            }
            startTime = new Date;
            require_global(logic, cb, render_error, controllerNs);
        }
    }
}

function render_control_toStartLogic(resContainer) {
    resContainer.logicReady = true;
    render_control_startLogic(resContainer);
}

function render_control_startLogic(resContainer) {
    var box = getElementById(resContainer.boxId);
    var logicResult;
    var real_data = resContainer.real_data || {};
    if (!resContainer.logicRunned && resContainer.logicFn && resContainer.logicReady && resContainer.rendered) {
        if (isDebug) {
            logicResult = resContainer.logicFn(box, real_data) || {};
        } else {
            try {
                logicResult = resContainer.logicFn(box, real_data) || {};
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
}

//用户扩展类
function render_control_setExtTplData_F() {}

//用户扩展全局功能方法
function render_control_setExtTplData(obj) {
    if (core_object_typeof(obj) !== 'object') {
        throw 'The method "steel.setExtTplData(obj)" used in your app need an object as the param.';
    }
    render_control_setExtTplData_F.prototype = obj;
    render_control_setExtTplData_F.prototype.constructor = render_control_setExtTplData_F;
}

var render_control_render_moduleAttrName = 's-module';
var render_control_render_moduleAttrValue = 'ismodule';
var render_control_render_childWaitingCache = {};//渲染列表

function render_control_render(resContainer) {
    var boxId = resContainer.boxId;
    var childWaitingCache = render_control_render_childWaitingCache[boxId] = [];
    if(!resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
        return;
    }
    var tplFn = resContainer.tplFn;
    var real_data = resContainer.real_data;
    if (!tplFn || !real_data) {
        return;
    }

    var html = resContainer.html;
    if (!html) {
        var parseResultEle = null;
        var extTplData = new render_control_setExtTplData_F();
        var retData = extTplData;
        for (var key in real_data) {
            retData[key] = real_data[key];
        }
        try{
            html = tplFn(retData);
        }catch(e) {
            render_error(e);
            return;
        }
        resContainer.childrenid = {};
        //子模块分析
        var tplParseResult = render_parse(html);
        //去掉节点上的资源信息
        for(var i = 0, len = tplParseResult.length; i < len; i++){
            parseResultEle = tplParseResult[i];
            html = html.replace(parseResultEle['s-all'], ' ' + render_control_render_moduleAttrName + '=' + render_control_render_moduleAttrValue + ' ' + parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        }
        render_control_handleChild(boxId, tplParseResult);
        resContainer.html = html;
    }
    if (!resContainer.cssReady) {
        return;
    }
    //1. box存在，addHTML，运行logic，运行子队列（子模块addHTML）
    //2. box不存在，则进入队列，待渲染
    var box = getElementById(boxId);
    
    if (box) {
        render_control_destroyLogic(resContainer);
        render_control_destroyChildren(resContainer.toDestroyChildrenid);
        box.innerHTML = html;
        render_base_count--;
        render_control_destroyCss(resContainer);
        resContainer.rendered = true;
        render_control_startLogic(resContainer);
        for(var i = 0, l = childWaitingCache.length; i < l; ++i) {
            childWaitingCache[i]();
        }
        childWaitingCache = render_control_render_childWaitingCache[boxId] = [];
        if (render_base_count <= 0) {
            core_notice_trigger('allDomReady');
        }
    } else {
        var parentId = resContainer.parentId;
        if (parentId && render_control_render_childWaitingCache[parentId]) {
            render_control_render_childWaitingCache[parentId].push(render_control_render);
        }
    }
}

var render_control_setCss_cssPrefix = 'S_CSS_';
var render_control_setCss_cssCache = {};//css容器


function render_control_setCss(resContainer) {
    var cssCallbackFn;
    var startTime = null;
    var endTime = null;
    var css = resContainer.css;
    var boxId = resContainer.boxId;
    var controllerNs = render_base_controllerNs[boxId];
    var linkId = render_control_getLinkId(css);//render_control_setCss_cssPrefix + resContainer.css.replace(/\//g, '_');
    var cssCache = render_control_setCss_cssCache[boxId] = render_control_setCss_cssCache[boxId] || {
        last: null,
        cur: null
    };
    var cb = cssCallbackFn = function(){
        cssCache.cur = linkId;
        if(cb === cssCallbackFn) {
            endTime = new Date;
            core_notice_trigger('cssTime', {
                startTime: startTime,
                cssTime: (endTime - startTime) || 0,
                ctrlNS: controllerNs
            });
            resContainer.cssReady = true;
            render_control_render(resContainer);
            //抛出css加载完成事件
        }
    }
    startTime = new Date;
    css && resource_res.css(css, cb, function(){
        resContainer.cssReady = true;
        render_control_destroyCss(boxId);
        render_control_render(resContainer);
    }, linkId);
}

function render_control_destroyCss(resContainer) {
    var boxId = resContainer.boxId;
    var cssCache = render_control_setCss_cssCache[boxId];
    var css = resContainer.css;
    var linkId = render_control_getLinkId(css);
    if (!cssCache) {
        return;
    }
    
    if (linkId && linkId == cssCache.last) {
        return;
    }
    
    if (cssCache.last) {
        var cssDom = getElementById(cssCache.last);
        cssDom && core_dom_removeNode(cssDom);
    }
    cssCache.last = cssCache.cur;
    cssCache.cur = null;
}

function render_control_getLinkId(path) {
    return path && render_control_setCss_cssPrefix + path.replace(/(\.css)$/i, '').replace(/\//g, '_');
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
                endTime = new Date;
                core_notice_trigger('tplTime', {
                    startTime: startTime,
                    tplTime: endTime - startTime || 0,
                    ctrlNS: controllerNs
                });
                resContainer.tplFn = jadefn;
                render_control_setTpl_toRender(resContainer);
            }
        }
        startTime = new Date;
        
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

function render_control_setData(resContainer) {
    
    var dataCallbackFn;
    var data = resContainer.data;
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var startTime = null;
    var endTime = null;
    // var ajaxRunTime = 10;//计算ajax时间时，运行时间假定需要10ms（实际在10ms内）

    if (data === null || data === 'null') {
        render_control_setData_toRender({}, resContainer);
        return;
    }
    if (!data) {
        return;
    }
    var dataType = core_object_typeof(data);
    
    if (dataType === 'object') {
        render_control_setData_toRender(data, resContainer);
    } else if (dataType === 'string') {
        var cb = dataCallbackFn = function(ret) {
            if (cb === dataCallbackFn) {
                //拿到ajax数据
                endTime = new Date;
                core_notice_trigger('ajaxTime', {
                    startTime: startTime,
                    ajaxTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                // toRender(ret.data);//||
                render_control_setData_toRender(ret.data, resContainer);
            }
        };
        // resource_res.get(data, cb, render_error);
        //开始拿模块数据
        startTime = new Date;
        resource_res.get(data, cb, function(ret){
            resContainer.data = ret || null;
            resContainer.real_data = resContainer.data;
            render_error(ret);
        });
    }
}

function render_control_setData_toRender(data, resContainer) {
    resContainer.dataReady = true;
    if (resContainer.forceRender || !core_object_equals(data, resContainer.real_data)) {
        resContainer.real_data = data;
        render_control_render(resContainer);
    } else {
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
    tpl  : 'tplFn',
    data : 'real_data',
    logic: 'logicFn'
}

function render_control_main(boxId) {
    render_base_count++;
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
    var toDoSetsTimer = null;
    
    //状态类型 newset|loading|ready
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned
 
    var changeResList = {};
    var control = {
        id : boxId,
        setForceRender: function(_forceRender) {
            resContainer.forceRender = _forceRender;
        },
        get: function(url, type) {
            var result = '';
            /*if(type === 'tpl'){}*/
            return result;
        },
        set: function(type, value) {
            if (!boxId) {
                return;
            }
            if(core_object_typeof(type) === 'object') {
                for(var key in type) {
                    control.set(key, type[key]);
                }
                return;
            }

            if(changeResList[type] = render_control_checkResChanged(resContainer, type, value)){
                resContainer[type] = value;
                toDoSets();
                return;
            }
            resContainer[type] = value;
            
        },
        _refresh: function() {
            resContainer.needToTriggerChildren = true;
            resContainer.real_data = undefined;
            changeResList['data'] = true;
            toDoSets();
        },
        _destroy: function() {
            resContainer.real_data = undefined;
            boxId = control._controller = resContainer = box = toDoSetsTimer = undefined;
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
            } else if (resContainer.fromParent) {
                if (resContainer[type]) {
                    changeResList[type] = true;
                }
            }
        }

        toDoSets();
    }

    function toDoSets() {
        clearTimeout(toDoSetsTimer);
        toDoSetsTimer = setTimeout(function() {
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
            dataChanged && render_control_setData(resContainer);
            cssChanged && render_control_setCss(resContainer);
            logicChanged && render_control_setLogic(resContainer);
            resContainer.childrenChanged && render_control_setChildren(resContainer);
        });
    }
}
/////import ../core/dom/querySelectorAll

var render_run_controllerLoadFn = {};
var render_run_rootScope = {};

//controller的boot方法
function render_run(box, controller) {
    var boxId, control, controllerLoadFn, controllerNs;
    var startTime = null;
    var endTime = null;

    if (typeof box === 'string') {
        boxId = box;
        box = getElementById(boxId);
    } else {
        boxId = box.id;
        if (!boxId) {
            box.id = boxId = render_base_idMaker();
        }
    }
    
    if (box && box !== document.body) {
        //找到它的父亲
        var parentNode = box.parentNode;
        var parentResContainer;
        while(parentNode && parentNode !== docElem && (!parentNode.id || !(parentResContainer = render_base_resContainer[parentNode.id]))) {
            parentNode = parentNode.parentNode;
        }
        if (parentResContainer) {
            parentResContainer.childrenid[boxId] = true;
        }
    }
    render_run_controllerLoadFn[boxId] = undefined;
    if (controller && typeof controller === 'string') {
        render_base_controllerNs[boxId] = controller;
        controllerLoadFn = render_run_controllerLoadFn[boxId] = function(controller){
            if (controllerLoadFn === render_run_controllerLoadFn[boxId] && controller) {
                endTime = new Date;
                core_notice_trigger('ctrlTime', {
                    startTime: startTime,
                    ctrlTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                render_run_controllerLoadFn[boxId] = undefined;
                render_run(boxId, controller);
            }
        };
        startTime = new Date;
        require_global(controller, controllerLoadFn, render_error);
        return;
    }

    control = render_base_controlCache[boxId];

    if (control) {
        if (control._controller) {
            control._destroy();
            control = undefined;
        } else if (!controller) {
            control._refresh();
            return;
        }
    }
    render_base_controlCache[boxId] = control = control || render_control_main(boxId);

    if (controller) {
        control._controller = controller;
        controller(control, render_run_rootScope);
    }
}

function core_crossDomainCheck(url) {
    var urlPreReg = /^[^:]+:\/\/[^\/]+\//;
    var locationMatch = location.href.match(urlPreReg);
    var urlMatch = url.match(urlPreReg);
    return (locationMatch && locationMatch[0]) === (urlMatch && urlMatch[0]);
}

//@Finrila 未处理hashchange事件

var router_listen_queryTime = 5;
var router_listen_count;
var router_listen_lastStateData = undefined;

function router_listen() {
    router_listen_lastStateData = history.state || 0;
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
        router_listen_setRouter(href);
    });
    var popstateTime = 0;
    core_event_addEventListener(window, 'popstate', function() {
        if (router_listen_lastStateData > (history.state || 0)) {
            router_base_routerType = 'back';
        } else {
            router_base_routerType = 'forward';
        }
        router_listen_lastStateData = history.state || 0;
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
    router_base_currentHref = url;
    router_base_params = router_makeParams(url);
    var controller = router_match(url);
    if (controller !== false) {
        router_listen_fireRouterChange(controller);
    } else {
        location.reload();
    }
}

function router_listen_setRouter(url, replace) {
    var basePath = location.href;
    url = core_fixUrl(basePath, url);
    
    if (android && history.length === 1 || !core_crossDomainCheck(url)) {
        if (replace) {
            location.replace(url);
        } else {
            location.href = url;
        }
    } else {
        if (replace) {
            router_base_routerType = 'replace';
            history.replaceState(router_listen_lastStateData, null, url);
        } else {
            if (router_base_currentHref !== url) {
                router_base_routerType = 'new';
                history.pushState(++router_listen_lastStateData, null, url);
            } else {
                router_base_routerType = 'refresh';
            }
        }
        router_listen_handleHrefChenged(url);
    }
}

//派发routerChange事件，返回router变化数据 @shaobo3
function router_listen_fireRouterChange(controller) {
    core_notice_trigger('routerChange', {
        controller: controller,
        changeType: router_base_routerType
    });
}

var router_router = {
    set: router_listen_setRouter,
    get: router_router_get
};

function router_router_get() {
    if (!router_base_params) {
        router_base_params = router_makeParams(location.toString());
    }
    return router_base_params;
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
    return resource_fixUrl_handle(path, url, resource_basePath, currentRouter.url.replace(/\/([^\/]+)$/, '/'));
}

function resource_fixUrl_handle(path, url, basePath, hrefPath) {
    return core_fixUrl(path || basePath || hrefPath, url);
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
        resource_queue_list[url][i][access](data, url);
    }
}

function resource_queue_del(url) {
    url in resource_queue_list && (delete resource_queue_list[url]);
}/*版本号*/
var loader_base_version;/*
 * 创建节点
 * @method core_dom_createElement
 * @private
 * @param {string} tagName
 */
function core_dom_createElement( tagName ) {
	return document.createElement( tagName );
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
    
    if (url == '') {
        throw 'scriptLoader: url is null';
    }
    url = /(\.js)$/.test(url) ? url : (url + '.js');
    url = url + '?version=' + loader_base_version;
    
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
                        getElementsByTagName("head")[0].removeChild(js);
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
    
    getElementsByTagName("head")[0].appendChild(js);
    
    if (opts.timeout > 0) {
        requestTimeout = setTimeout(function(){
            try{
                getElementsByTagName("head")[0].removeChild(js);
            }catch(exp){
                
            }
            callback(false);
        }, opts.timeout);
    }
    return js;
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


function loader_css( url, callback, load_ID ){
    var link = core_dom_createElement('link');
    var load_div = null;
    var domID = core_uniqueKey();
    var timer = null;
    var _rTime = 300;//3000;
    url = /(\.css)$/.test(url) ? url : (url + '.css');
    url = url + '?version=' + loader_base_version;

    core_dom_setAttribute(link, 'rel', 'Stylesheet');
    core_dom_setAttribute(link, 'type', 'text/css');
    core_dom_setAttribute(link, 'charset', 'utf-8');
    core_dom_setAttribute(link, 'id', load_ID);
    /*if(IE){
        (link.Stylesheet || link.sheet).addImport(url);
    }else {
        core_dom_setAttribute(link, 'href', url);
        head.appendChild(link);
    }*/
    core_dom_setAttribute(link, 'href', url);
    head.appendChild(link);
    load_div = core_dom_createElement('div');
    core_dom_setAttribute(load_div, 'id', load_ID);
    core_hideDiv_appendChild(load_div);

    timer = function(){
        if(parseInt(window.getComputedStyle ? getComputedStyle(load_div, null)['height'] : load_div.currentStyle && load_div.currentStyle['height']) === 42){
            core_hideDiv_removeChild(load_div);
            callback(true);
            return;
        }
        if(--_rTime > 0){
            setTimeout(timer, 10);
        }else {
            log('Error: css("' + url + '" timeout!');
            core_hideDiv_removeChild(load_div);
            callback(false);
        }
    };
    setTimeout(timer, 50);
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

var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle(resource_fixUrl(name, 'js'), succ, err, loader_js);
    },

    css: function(name, succ, err, cssId) {
        resource_res_handle(resource_fixUrl(name, 'css'), succ, err, loader_css, cssId);
    },

    get: function(name, succ, err) {
        resource_res_handle(resource_fixUrl(name, 'ajax'), succ, err, resource_request);//loader_ajax);
    }
};

function resource_res_handle(url, succ, err, loader, cssId) {

    //check 队列    
    if(resource_queue_list[url]){
        resource_queue_push(url, succ, err);
    }else {
        resource_queue_create(url);
        resource_queue_push(url, succ, err);
        //loader
        loader(url, function(access, data) {
            resource_queue_run(url, access, data);
            resource_queue_del(url);
        }, cssId);
    }
}

//外部异步调用require方法
function require_global(deps, complete, errcb, currNs, runDeps) {
    var depNs;
    var depDefined = 0;
    var errored = 0;
    var baseModulePath = currNs && require_base_nameToPath(currNs);
    deps = [].concat(deps);
    for (var i = 0, len = deps.length; i < len; i++) {
        depNs = deps[i] = require_base_idFix(deps[i], baseModulePath);
        if (require_base_module_loaded[depNs]) {
            checkDepDefined(depNs);
        } else {
            ! function(depNs) {
                resource_res.js(depNs, function() {
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
    var basePath = require_base_nameToPath(currNs);
    return require;

    function require(ns) {
        if (core_object_typeof(ns) === 'array') {
            var paramList = core_array_makeArray(arguments);
            paramList[3] = paramList[3] || currNs;
            return require_global.apply(window, paramList);
        }
        ns = require_base_idFix(ns, basePath);

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
        ns = require_base_idFix(pkg[i], basePath);
        nsConstructor = require_base_module_fn[ns];
        if (!nsConstructor) {
            log('Warning: ns("' + ns + '") has not constructor!');
            resultList.push(undefined);
        } else {
            if (!require_base_module_runed[ns]) {
                if (require_base_module_deps[ns]) {
                    require_runner(require_base_module_deps[ns], require_base_nameToPath(ns));
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
        setTimeout(function() {
            require_global(deps, doDefine, function() {
                log('Error: ns("' + ns + '") deps loaded error!', '');
            }, ns, false);
        });
    } else {
        doDefine();
    }
    

    function doDefine() {
        require_base_module_defined[ns] = true;
        core_notice_trigger(require_base_event_defined, ns);
        log('Debug: define ns("' + ns + '")');
    }

}

//定义boot
function require_boot(ns) {
    require_global([ns]);
}

 

function loader_config(parseParamFn) {
  loader_base_version = parseParamFn('version', loader_base_version);
}

config_push(loader_config);//暂不做
 

var resource_config_slash = '/';
function resource_config(parseParamFn) {
    resource_jsPath = parseParamFn('jsPath', resource_jsPath);
    resource_cssPath = parseParamFn('cssPath', resource_cssPath);
    resource_ajaxPath = parseParamFn('ajaxPath', resource_ajaxPath);
    resource_basePath = parseParamFn('basePath', resource_config_slash);
    resource_define_apiRule = parseParamFn('defApiRule', resource_define_apiRule);
}

config_push(resource_config);
 
 /**
 * 路由配置
 */

config_push(router_config);

function router_config(parseParamFn, config) {
  router_base_routerTable = parseParamFn('router', router_base_routerTable);
  router_base_useHash = parseParamFn('useHash', router_base_useHash);
  router_base_singlePage = parseParamFn('singlePage', router_base_singlePage);
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
var router_pathToRegexp_PATH_REGEXP = new RegExp([
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

    var regexp = new RegExp('(?:' + parts.join('|') + ')', router_pathToRegexp_flags(options));
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

    if (path instanceof RegExp) {
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

    return router_pathToRegexp_attachKeys(new RegExp('^' + route, router_pathToRegexp_flags(options)), keys);
}

function router_use(path, controller) {
    var key, value, _results;
    if (typeof path === 'object' && !(path instanceof RegExp)) {
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
            controller: controller,
            keys: keys
        });
    }
}



function router_boot(){
    for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
        var items = router_base_routerTable[i];
        router_use(items[0], items[1]);
    }
    //浏览器支持HTML5，且应用设置为单页面应用时，绑定路由侦听； @shaobo3
    isHTML5 && router_base_singlePage && router_listen();
}

 

  config_push(function(parseParamFn) {
    isDebug = parseParamFn('debug', isDebug);
    mainBox = parseParamFn('mainBox', mainBox);
  });

  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.router = router_router;
  steel.on = core_notice_on;
  steel.off = core_notice_off;
  steel.setExtTplData = render_control_setExtTplData;

  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    require_global(ns, function() {
      router_boot();
      if (mainBox) {
        var controller = router_match(location.toString());
        if (controller !== false) {
          render_run(mainBox, controller);
          core_notice_trigger('stageChange', mainBox);
        }
      }
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
  
  core_notice_on('routerChange', function(res) {
    var controller = res.controller;
    var changeType = res.changeType;
    window.scrollTo(0, 0);
    render_run(mainBox, controller);
    core_notice_trigger('stageChange', mainBox);
    log("Debug: routerChange", mainBox, controller, changeType);
  });

  window.steel = steel;

}(window);