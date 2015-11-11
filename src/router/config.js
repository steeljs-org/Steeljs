/**
 * 路由配置
 */
//import ./base
//import config

config_push(router_config);

function router_config(parseParamFn, config) {
  router_base_routerTable = parseParamFn('router', router_base_routerTable);
  router_base_useHash = parseParamFn('useHash', router_base_useHash);
  router_base_singlePage = parseParamFn('singlePage', router_base_singlePage);
}