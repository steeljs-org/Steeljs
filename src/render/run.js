//import ./base
//import ./error
//import ./control/main
//import core/notice
//import core/object/isString
//import core/object/isEmpty
//import ./stage
//import router/router
//import router/history

var render_run_controllerLoadFn = {};
var render_run_rootScope = {};
var render_run_renderingMap = {};
var render_run_renderedTimer;

core_notice_on('stageChange', function() {
    render_run_renderingMap = {};
});

core_notice_on('rendered', function(module) {
    delete render_run_renderingMap[module.boxId];
    if (render_run_renderedTimer) {
        clearTimeout(render_run_renderedTimer);
    }
    // render_run_renderedTimer = setTimeout(function() {
        if (core_object_isEmpty(render_run_renderingMap)) {
            core_notice_trigger('allRendered');
            core_notice_trigger('allDomReady');
        }
    // }, 44);
});

//controller的boot方法
function render_run(stageBox, controller) {
    var stageBoxId, boxId, control, controllerLoadFn, controllerNs;
    var startTime = null;
    var endTime = null;
    var routerType = router_router_get().type;
    var isMain = stageBox === mainBox;
    var renderFromStage;

    var lastBoxId;

    if (typeof stageBox === 'string') {
        stageBoxId = stageBox;
        stageBox = getElementById(stageBoxId);
    } else {
        stageBoxId = stageBox.id;
        if (!stageBoxId) {
            stageBox.id = stageBoxId = render_base_idMaker();
        }
    }

    boxId = stageBoxId;
    
    if (isMain) {
        boxId = render_stage(stageBoxId, routerType);
        renderFromStage = render_stage_ani(stageBoxId, '', function(currId, lastId, renderFromStage) {
            if (currId !== lastId) {
                lastBoxId = lastId;
                core_notice_trigger(lastId + 'leave', function(transferData) {
                    if (transferData) {
                        router_history_state_set(router_router_transferData_key, transferData);
                    }
                });
                if (renderFromStage && routerType.indexOf('refresh') === -1) {
                    triggerEnter(false);
                }
            }
        });

        core_notice_trigger('stageChange', getElementById(boxId), renderFromStage);
        
        render_run_renderingMap[boxId] = true;
        if (!renderFromStage || routerType.indexOf('refresh') > -1) {
            async_controller();
        } else {
            render_control_triggerRendered(boxId);
        }
    } else {
        render_run_renderingMap[boxId] = true;
        async_controller();
    }

    function async_controller() {
        //处理异步的controller
        render_run_controllerLoadFn[boxId] = undefined;
        if (core_object_isString(controller)) {
            render_base_controllerNs[boxId] = controller;
            controllerLoadFn = render_run_controllerLoadFn[boxId] = function(controller){
                if (controllerLoadFn === render_run_controllerLoadFn[boxId] && controller) {
                    endTime = now();
                    core_notice_trigger('ctrlTime', {
                        startTime: startTime,
                        ctrlTime: (endTime - startTime) || 0,
                        ctrlNS: controllerNs
                    });
                    render_run_controllerLoadFn[boxId] = undefined;
                    run_with_controllerobj(controller);
                }
            };
            startTime = now();
            require_global(controller, controllerLoadFn, render_error);
            return;
        } else {
            run_with_controllerobj();
        }
        ////
    }
    
    function run_with_controllerobj(controllerobj) {
        controller = controllerobj || controller;
        if (stageBox !== document.body) {
            //找到它的父亲
            var parentNode = stageBox.parentNode;
            var parentResContainer;
            while(parentNode && parentNode !== docElem && (!parentNode.id || !(parentResContainer = render_base_resContainer[parentNode.id]))) {
                parentNode = parentNode.parentNode;
            }
            if (parentResContainer) {
                parentResContainer.childrenid[boxId] = true;
            }
        }

        control = render_base_controlCache[boxId];
        if (control) {
            if (control._controller === controller) {
                control.refresh();
                triggerEnter(false);
                return;
            }
            if (control._controller) {
                control._destroy();
            }
        }
        render_base_controlCache[boxId] = control = render_control_main(boxId);
        if (controller) {
            control._controller = controller;
            controller(control, render_run_rootScope);
        }
        control.deal();
        triggerEnter(true);
    }

    function triggerEnter(isInit) {
        var transferData = router_history_state_get(router_router_transferData_key);
        if (isInit) {
            core_notice_trigger(boxId + 'init', transferData);
        }
        core_notice_trigger(boxId + 'enter', transferData, isInit);
    }
}