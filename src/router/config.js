/**
 * 路由配置
 */
//import ./base
//import config

config_push(router_config);

function router_config(parseParamFn, config) {
  router_base_routerTable = parseParamFn('router', router_base_routerTable);
  // @Finrila hash模式处理不可用状态，先下掉
  // router_base_useHash = parseParamFn('useHash', router_base_useHash);
  router_base_singlePage = isHTML5 ? parseParamFn('singlePage', router_base_singlePage) : false;
}