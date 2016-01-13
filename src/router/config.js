/**
 * 路由配置
 */
//import ./base
//import config

config_push(router_config);

function router_config(parseParamFn, config) {
  router_base_routerTable = parseParamFn('router', router_base_routerTable);
  var _isHash = (("onhashchange" in window) && !!location.replace && !!location.reload);
  router_base_useHash = _isHash?parseParamFn('useHash', router_base_useHash):false;
  router_base_singlePage = isHTML5 ? parseParamFn('singlePage', router_base_singlePage) : false;
}