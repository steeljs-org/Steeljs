/**
 * router.getPath
 * 获取当前路由path，支持H5的history和非H5的hash两种方式
 * @return path String
 * @author shaobo3@staff.sina.com.cn
 * @create 15-2-3 上午12:19
 * @example
 *      var path = router_getPath();
 */

//import ./base
//import core/object/merge
//import core/queryToJson
//import core/parseURL

var router_getPath_hasStrip = /^#*/;

function router_getPath(url){
    var parseUrl, parsePath, subHref;
    parseUrl = core_parseURL(url);
    router_base_params = {};
    //获取当前path
    subHref = parseUrl.hash.replace(router_getPath_hasStrip, '').replace(/\/+/g, '/');
    subHref = subHref.charAt(0) === '/' ? subHref : ('/' + subHref);
    subHref = location.protocol + '//' + location.host + subHref

    router_base_params = !isHTML5 && router_base_useHash ? core_parseURL(subHref) : parseUrl;
    parsePath = router_base_params.path.replace(/\/+/g, '/');
    router_base_params.path = isDebug ? parsePath.replace(/\.(jade|html)$/g, '') : parsePath;
    router_base_params.search = router_base_params.query;
    router_base_params.query = core_queryToJson(router_base_params.query);

    return router_base_params.path;
}