//import ../base
//import ../run

function render_control_setChildren(resContainer) {
    var children = resContainer.children || {};
    for (var key in children) {
        //如果存在，相应的key则运行
        if (resContainer.s_childMap[key]) {
            render_run(resContainer.s_childMap[key], children[key]);
        }
    }
}

function render_control_destroyChildren(childrenid) {
    childrenid = childrenid || {};
    for (var id in childrenid) {
        var childResContainer = render_base_resContainer[id];
        var childControl = render_base_controlCache[id];
        var childControllerNs = render_base_controllerNs[id];
        if (childControl) {
            childControl._destroy();
            delete render_base_controlCache[id];
        }

        if (childControllerNs) {
            delete render_base_controllerNs[id];
        }
        
        if (childResContainer) {
            render_control_destroyChildren(childResContainer.childrenid);
            if (childResContainer.logicResult) {
              childResContainer.logicResult.destroy && childResContainer.logicResult.destroy();
              delete childResContainer.logicResult;
            }
            delete render_base_resContainer[id];
        }
    }
    
}