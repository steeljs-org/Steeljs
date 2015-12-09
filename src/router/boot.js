/**
 * 路由启动接口
 * 1、设置侦听
 * 2、主动响应第一次的url(第一次是由后端渲染的，如果没有真实文件，无法启动页面)
 *
 */

//import ./base
//import ./listen
//import ./use

function router_boot() {
  for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
    var items = router_base_routerTable[i];
    router_use(items[0], items[1]);
  }
  var controller = router_match();
  if (controller) {
    router_listen_fireRouterChange(controller);
  }
  //浏览器支持HTML5，且应用设置为单页面应用时，绑定路由侦听； @shaobo3
  isHTML5 && router_base_singlePage && router_listen();
}