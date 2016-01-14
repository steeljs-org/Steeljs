/**
 * 销毁一个模块，样式，逻辑，节点
 */
//import ../base
//import ./sData
//import render/control/setLogic
//import render/control/setCss

function render_control_destroy(idMap, onlyRes) {
  idMap = idMap || {};
  if (typeof idMap === 'string') {
    var _idMap = {};
    _idMap[idMap] = true;
    idMap = _idMap;
  }
  for (var id in idMap) {
    render_control_destroy_one(id, onlyRes);
  }
}

function render_control_destroy_one(id, onlyRes) {
  var resContainer = render_base_resContainer[id];
  var childControl = render_base_controlCache[id];
  var childControllerNs = render_base_controllerNs[id];

  if (!onlyRes) {
    if (childControl) {
      childControl._destroy();
      delete render_base_controlCache[id];
    }
    if (childControllerNs) {
      delete render_base_controllerNs[id];
    }
  }
  if (resContainer) {
    render_control_destroyLogic(resContainer);
    render_control_setCss_destroyCss(resContainer);
    render_control_destroy(resContainer.childrenid);
    render_control_sData_delData(id);
    delete render_base_resContainer[id];
  }
}