//import ../base
//import ../run
//import render/control/setLogic
//import render/control/setCss
//import ./destroy

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
    render_control_destroy(childrenid);
}