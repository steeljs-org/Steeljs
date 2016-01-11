/**
 * 路由启动接口
 * 1、设置侦听
 * 2、主动响应第一次的url(第一次是由后端渲染的，如果没有真实文件，无法启动页面)
 *
 */

//import ./base
//import ./listen
//import ./use
//import ./router

function router_boot() {
    for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
        var items = router_base_routerTable[i];
        router_use(items[0], items);
    }
    router_router_clearTransferData();
    if (router_base_useHash) {
        //hash模式下，只是更新一下url中的hash信息;
        router_router_initHash();
    }
    if (router_router_get(true).config) {
        router_listen_fireRouterChange();
    }
    //浏览器支持HTML5，且应用设置为单页面应用时，绑定路由侦听； @shaobo3
    isHTML5 && router_base_singlePage && router_listen();
}