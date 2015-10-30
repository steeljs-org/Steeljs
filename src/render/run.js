//import ./base
//import ./error
//import ./control/main
//import ../core/dom/querySelectorAll
//import core/notice

var render_run_controllerLoadFn = {};
var render_run_rootScope = {};

//controller的boot方法
function render_run(box, controller) {
    var boxId, control, controllerLoadFn, controllerNs;
    var startTime = null;
    var endTime = null;

    if (typeof box === 'string') {
        boxId = box;
        box = getElementById(boxId);
    } else {
        boxId = box.id;
        if (!boxId) {
            box.id = boxId = render_base_idMaker();
        }
    }
    
    if (box && box !== document.body) {
        //找到它的父亲
        var parentNode = box.parentNode;
        var parentResContainer;
        while(parentNode && parentNode !== docElem && (!parentNode.id || !(parentResContainer = render_base_resContainer[parentNode.id]))) {
            parentNode = parentNode.parentNode;
        } 
        if (parentResContainer) {
            parentResContainer.childrenid[boxId] = true;
        }
    }
    render_run_controllerLoadFn[boxId] = undefined;
    if (controller && typeof controller === 'string') {
        render_base_controllerNs[boxId] = controller;
        controllerLoadFn = render_run_controllerLoadFn[boxId] = function(controller){
            if (controllerLoadFn === render_run_controllerLoadFn[boxId] && controller) {
                endTime = new Date;
                core_notice_fire('ctrlTime', {
                    startTime: startTime,
                    ctrlTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                render_run_controllerLoadFn[boxId] = undefined;
                render_run(boxId, controller)
            }
        };
        startTime = new Date;
        require_global(controller, controllerLoadFn, render_error);
        return;
    }

    control = render_base_controlCache[boxId];
    controllerNs = render_base_controllerNs[boxId];

    if (control) {
        if (control._controller) {
            control._destroy();
            control = undefined;
        } else if (!controller) {
            control._refresh();
            return;
        }
    }
    render_base_controlCache[boxId] = control = control || render_control_main(boxId, controllerNs);

    if (controller) {
        control._controller = controller;
        controller(control, render_run_rootScope);
    }
}