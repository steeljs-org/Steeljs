//router资源

//import core/notice
//import core/fixUrl
//import core/queryToJson
//import core/object/isNumber
//import core/crossDomainCheck
//import ./base
//import ./listen
//import ./parseURL
//import ./match
//import ./history

//当前访问path的变量集合,以及location相关的解析结果
var router_router_value;

var router_router = {
    get: router_router_get,
    push: router_router_push,
    replace: router_router_replace,
    set: router_router_set,
    back: router_router_back
};
/**
 * 获取当前路由信息
 * @return {object} 路由信息对象
 */
function router_router_get(refresh) {
    if (refresh || !router_router_value) {
        router_router_refreshValue();
    }
    return router_router_value;
}
/**
 * 路由前进到某个地址
 * @param  {string} url 页面地址
 * @return {undefined} 
 */
function router_router_push(url) {
    router_router_set(url);
}
/**
 * 将路由替换成某个地址
 * @param  {string} url 页面地址
 * @return {undefined}
 */
function router_router_replace(url) {
    router_router_set(url, true);
}
/**
 * 设置路由
 * @param  {string} url     地址
 * @param  {boolean} replace 是否替换当前页面 不产生历史
 * @return {undefined} 
 */
function router_router_set(url, replace) {
    var basePath = location.href;
    url = core_fixUrl(basePath, url || '');
    
    if (android && history.length === 1 || !core_crossDomainCheck(url)) {
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
        router_listen_handleHrefChenged(url);
    }
}
/**
 * 路由后退
 * @param  {string} url 后退后替换的地址 可以为空
 * @param  {number} num 后退的步数 默认为1步 必须为大于0的正整数
 * @return {undefined}
 */
function router_router_back(url, num) {
    log('Info', 123131);
    if (url && core_crossDomainCheck(url)) {
        core_notice_on('popstate', function popstate() {
            core_notice_off('popstate', popstate);
            router_history_replaceState(core_fixUrl(router_router_get().url, url));
        });
    }
    if (core_object_isNumber(num) && num > 0) {
        history.go(-num);
    } else {
        history.back();
    }
}
/**
 * 内部使用的路由信息刷新方法
 * @return {object} 路由信息对象
 */
function router_router_refreshValue() {
    router_router_value = router_parseURL();
    var path = router_router_value.path;
    router_router_value.path = isDebug ? path.replace(/\.(jade)$/g, '') : path;
    router_router_value.search = router_router_value.query;
    router_router_value.query = core_queryToJson(router_router_value.query);
    router_router_value.type = router_base_routerType;
    router_router_value.prev = router_base_prevHref;
    var matchResult = router_match(router_router_value);
    if (matchResult) {
        router_router_value.config = matchResult.config;
        router_router_value.param = matchResult.param;
    }
    return router_router_value;
}
