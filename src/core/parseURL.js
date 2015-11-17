/*
 * parse URL
 * @method core_parseURL
 * @private
 * @param {string} str
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
function core_parseURL( url ) {
	var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z-]+)?(?::(\d+))?(?:(\/[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    var names = [ "url", "scheme", "slash", "host", "port", "path", "query", "hash" ];
    var results = parse_url.exec(url);
    var retJson = {};
    for (var i = 0, len = names.length; i < len; i += 1) {
        if (!results) {
            throw ', there is something wrong with this url or resource : "' + url + '"';
        }
        retJson[names[i]] = results[i] || "";
    }
    retJson.port = parseInt(retJson.port || 80);
    return retJson;
}
