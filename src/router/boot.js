/**
 * 路由启动接口
 * 1、设置侦听
 * 2、主动响应第一次的url(第一次是由后端渲染的，如果没有真实文件，无法启动页面)
 *
 */

//import ./base
//import ./listen
//import ./use

function router_boot(){
    for (var i = 0, len = router_base_routerTable.length; i < len; i++) {
        var items = router_base_routerTable[i];
        if (steel.isDebug) {
            if (!items) {//IE8下若路由表中，用户不小心多写逗号，给出log提示
                log('Error: redundant "," in router of steel.config');
            }
        }
        router_use(items[0], items[1]);
    }
    router_listen();
}
