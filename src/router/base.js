/**
 * 路由变量定义区
 *
 */
//收集用户路由配置信息
var router_base_routerTable = [];

//处理后的路由集合，[{pathRegexp:RegExp, controller:'controllerFn', keys:{}}]
var router_base_routerTableReg = [];

//项目是否使用hash
var router_base_useHash = false;

//应用是否支持单页面（跳转与否），默认应用是单页面
var router_base_singlePage = true;

//当前访问path的变量集合,以及location相关的解析结果
var router_base_params;
// init/new/forward/bak/refresh/replace
var router_base_routerType = 'init';
var router_base_prevHref;
var router_base_currentHref = location.toString();
