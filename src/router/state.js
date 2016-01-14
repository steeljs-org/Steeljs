/**
 * 地址管理，负责管理state的数据和当面页面在state历史中的索引位置
 */

//import core/object/isObject

//history pushState 及一些处理
function router_state_pushState(url, data) {
    history.pushState(data, undefined, url);
}
//history repaceState 及一些处理
function router_state_replaceState(url, data) {
    history.replaceState(data, undefined, url);
}
//获取当前的state
function router_state_getState() {
    return core_object_isObject(history.state) ? history.state : {};
}