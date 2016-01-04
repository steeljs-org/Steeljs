/**
 * 路由变量定义区
 *
 */
//收集用户路由配置信息
var router_base_routerTable = [];

//处理后的路由集合，[{pathRegexp:RegExp, controller:'controllerFn', keys:{}}]
var router_base_routerTableReg = [];

//应用是否支持单页面（跳转与否）
var router_base_singlePage = false;

// @Finrila hash模式处理不可用状态，先下掉
// //项目是否使用hash
// var router_base_useHash = false;

// init/new/forward/bak/refresh/replace
var router_base_routerType = 'init';
var router_base_prevHref;
var router_base_currentHref = location.toString();
