/**
 * 路由配置
 */
//import ./base
//import config

config_push(router_config);

function router_config(config) {
    if (config.router) {
        router_base_routerTable = config.router;
        router_base_useHash = config.useHash || router_base_useHash;
        router_base_singlePage = (config.singlePage !== router_base_singlePage ? config.singlePage : router_base_singlePage);
    }
}
