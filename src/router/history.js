/**
 * 地址管理，负责管理state的数据和当面页面在state历史中的索引位置
 */

//import core/object/extend
//import core/object/isObject

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
}