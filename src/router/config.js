/**
 * 路由配置
 */
//import ./base
//import config

config_push(router_config);

function router_config(config) {
  if (config.router) {
    router_base_routerTable = config.router || router_base_routerTable;
    router_base_useHash = config.useHash || router_base_useHash;
    if ('singlePage' in config) {
      router_base_singlePage = config.singlePage;
    }
  }
}