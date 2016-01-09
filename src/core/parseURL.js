/*
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
}