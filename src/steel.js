/**
 * Steel Hybrid SPA
 */

! function(window, undefined) {

  //import base
  //import config
  //import require/index
  //import loader/index
  //import resource/index
  //import resource/boot
  //import render/index
  //import router/index
  //import core/notice
  //import core/object/isString

  config_push(function(parseParamFn, config) {
    isDebug = parseParamFn('debug', isDebug);
    logLevel = parseParamFn('logLevel', logLevel);
    if (!config.logLevel && !isDebug) {
      logLevel = 'Error';
    }
    mainBox = parseParamFn('mainBox', mainBox);
    if (core_object_isString(mainBox)) {
      mainBox = getElementById(mainBox);
    }
  });

  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.stage = render_render_stage;
  steel.router = router_router;
  steel.on = core_notice_on;
  steel.off = core_notice_off;
  steel.setExtTplData = render_control_setExtTplData;
  steel.require = require_global;
  steel.config = config;

  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    require_global(ns, function() {
      resource_boot();
      render_boot();
      router_boot();
    });
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
    log("Info: routerChange", mainBox, controller, routerValue.type);
  });

  window.steel = steel;

}(window);
