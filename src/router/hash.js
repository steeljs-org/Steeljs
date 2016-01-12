/**
 * 地址管理，history的hash实现
 */

//import core/parseURL
//import core/queryToJson
//import core/jsonToQuery

//history pushState 及一些处理
function router_hash_pushState(url, data) {
    var _newURL = router_hash_stringify(url, data);
    location.href = _newURL;
}
//history repaceState 及一些处理
function router_hash_replaceState(url, data) {
    var _newURL = router_hash_stringify(url, data);
    if (_newURL === location.href)  {
        router_base_dataSetFlag = false;
        router_base_routerSetFlag = false;
        return;
    }
    location.replace(_newURL);
}
//获取当前的state
function router_hash_getState() {
    return router_hash_parse().state || {};
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