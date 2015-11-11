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
  //import core/log

  config_push(function(parseParamFn) {
    isDebug = parseParamFn('debug', isDebug);
    mainBox = parseParamFn('mainBox', mainBox);
  });

  //初始化data-main
  require_dataMain();
  steel.d = require_define;
  steel.res = resource_res;
  steel.run = render_run;
  steel.router = router_api;
  steel.setRouter = steel.router.set;
  steel.on = core_notice_on;
  steel.setExtTplData = render_control_setExtTplData;

  steel.boot = function(ns) {
    steel.isDebug = isDebug;
    setTimeout(function() {
      require_boot(ns);
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

  window.steel = steel;


}(window);