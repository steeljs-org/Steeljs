/**
 * 地址管理，history的hash实现
 */

//import core/object/isObject
//import core/object/extend
//import core/object/isObject
//import core/parseURL
//import core/queryToJson
//import core/jsonToQuery

// 当前页面在整个单页面跳转中的索引位置
var router_hash_stateIndex_key = '--steel-stateIndex';
var router_hash_state_data;
var router_hash_state_dataForPush;

router_hash_state_init();

//监听hashchange，更新state数据；
core_notice_on('hashchange', router_hash_state_init);

//history pushState 及一些处理
function router_hash_pushState(url) {
    console.log("pushState:::",router_base_noHistoryChange, router_base_noHistoryChange_set);
    router_hash_state_setPush(router_hash_stateIndex_key, router_hash_getStateIndex() + 1);
    location.href = router_hash_stringify(url, router_hash_stateForPush());
    router_hash_state_init();
}
//history repaceState 及一些处理
function router_hash_replaceState(url) {
    console.log("replaceState:::",router_base_noHistoryChange, router_base_noHistoryChange_set);
    location.replace(router_hash_stringify(url, router_hash_state_data));
}
//获取当前页面在整个单页面跳转中的索引位置
function router_hash_getStateIndex() {
    return router_hash_state_get(router_hash_stateIndex_key, 0);
}
//初始化state数据
function router_hash_state_init() {
    router_hash_state_dataForPush = {};
    router_hash_state_data = router_hash_state();
}
//获取当前的state
function router_hash_state() {
    return core_object_isObject(router_hash_parse().state)?
        router_hash_parse().state : {};
}
//获取下一个将要push页面的state数据
function router_hash_stateForPush() {
    return router_hash_state_dataForPush;
}
//获取当前state上的某值
function router_hash_state_get(key, defaultValue) {
    router_hash_state_data = router_hash_state();
    if (key in router_hash_state_data) {
        return Number(router_hash_state_data[key]);
    } else if (defaultValue !== undefined) {
        router_hash_state_set(key, defaultValue);
        return defaultValue;
    }
}
//设置值到缓存中，并更改history.state的值
function router_hash_state_set(key, value) {
    router_hash_state_data = {};
    var state = router_hash_parse().state;
    if (state) {
        for (var state_key in state) {
            router_hash_state_data[state_key] = state[state_key];
        }
    }
    core_object_extend(router_hash_state_data, key, value);
    router_base_noHistoryChange_set = true;//只是设置数据，不是url变化，阻止hashchange
    router_hash_replaceState(router_hash_parse().url);
}
//向下一个state的缓存区域添加数据项 并返回新的数据
function router_hash_state_setPush(key, value) {
    core_object_extend(router_hash_state_dataForPush, key, value);
}

//解析hash中的url和state
//#~    表示url
//#@    表示state
function router_hash_parse(){
    var _hash = core_parseURL(location.toString()).hash;
    //暂时不支持hash模式下的hash
    var _url = _hash.match(/#~([^#]+)/)?_hash.match(/#~([^#]+)/)[1]:location.toString();
    var _state = _hash.match(/#@([^#]+)/)?core_queryToJson(_hash.match(/#@([^#]+)/)[1]):{};
    return {url:_url, state:_state};
}

//生成hash的绝对url
function router_hash_stringify(url, state){
    var _result = core_parseURL(location.toString());
    var _hash = "#~" + (url || "") + "#@" + core_jsonToQuery(state || {});
    return _result.protocol + _result.slash + _result.host + _result.path + "#" + _hash;
}