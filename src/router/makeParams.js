/**
 * 生成路由结果
 */

//import ./base
//import core/queryToJson
//import core/parseURL
//import core/fixUrl

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
