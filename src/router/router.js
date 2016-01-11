//router资源

//import core/notice
//import core/fixUrl
//import core/queryToJson
//import core/object/isNumber
//import core/object/isString
//import core/object/isObject
//import core/crossDomainCheck
//import core/argsPolymorphism
//import ./base
//import ./listen
//import ./parseURL
//import ./match
//import ./history
//import ./hash

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

////core_notice_on('pophistory', router_router_onpopstate);

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
            router_base_routerSetFlag = true;
            //console.log("router_base_routerSetFlag", router_base_routerSetFlag);
            router_history_replaceState(url);
        } else {
            if (router_base_currentHref !== url) {
                router_base_routerType = 'new';
                router_base_routerSetFlag = true;
                //console.log("router_base_routerSetFlag", router_base_routerSetFlag);
                router_history_pushState(url);
            } else {
                router_base_routerType = 'refresh';
            }
        }
        router_router_isRouterAPICalled = true;
        router_router_onpopstate();
        router_listen_handleRouterChanged(url);
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
            //是否替换；超出索引，不符合，直接拒掉呗。
            url && location.replace(core_fixUrl(router_router_get().url, url));
            return false;
        }
        core_notice_on('pophistory', function popstate() {
            core_notice_off('pophistory', popstate);
            var currentUrl = router_router_get().url;
            url = url && core_fixUrl(currentUrl, url);
            if (url && url !== currentUrl) {
                if (core_crossDomainCheck(url)) {
                    router_base_routerType = 'refresh';
                    router_base_routerSetFlag = true;
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
