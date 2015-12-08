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
    mainBox = parseParamFn('mainBox', mainBox);
  });

  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.router = router_router;
  steel.on = core_notice_on;
  steel.off = core_notice_off;
  steel.setExtTplData = render_control_setExtTplData;

  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    require_global(ns, function() {
      router_boot();
      if (mainBox) {
        var controller = router_match(location.toString());
        if (controller !== false) {
          render_run(mainBox, controller);
          core_notice_fire('stageChange', mainBox);
        }
      }
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
  
  core_notice_on('routerChange', function(res) {
    var controller = res.controller;
    var changeType = res.changeType;
    window.scrollTo(0, 0);
    render_run(mainBox, controller);
    core_notice_fire('stageChange', mainBox);
    log("Debug: routerChange", mainBox, controller, changeType);
  });

  window.steel = steel;

}(window);