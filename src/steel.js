/**
 * WebApp
 */

! function(window, undefined) {

  //import base
  //import config
  //import require/index
  //import loader/index
  //import resource/index
  //import render/index
  //import router/index
  //import core/notice

  config_push(function(parseParamFn) {
    isDebug = parseParamFn('debug', isDebug);
    logLevel = parseParamFn('logLevel', logLevel);
    mainBox = parseParamFn('mainBox', mainBox);
  });

  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.router = router_router;
  steel.on = core_notice_on;
  steel.off = core_notice_off;
  steel.setExtTplData = render_control_setExtTplData;
  steel.require = require_global;
  steel.config = config;

  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    require_global(ns, router_boot);
  };

  steel._destroyByNode = function(node) {
    var id = node && node.id;
    var resContainer;
    if (id && (resContainer = render_base_resContainer[id])) {
      render_control_destroyLogic(resContainer);
      render_control_destroyChildren(resContainer.toDestroyChildrenid);
    }
  };
  
  core_notice_on('routerChange', function(routerValue) {
    var config = routerValue.config;
    var controller = config[1];
    render_run(mainBox, controller);
    window.scrollTo(0, 0);
    core_notice_trigger('stageChange', mainBox);
    log("Info: routerChange", mainBox, controller, routerValue.type);
  });

  window.steel = steel;

}(window);