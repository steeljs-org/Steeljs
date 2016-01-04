//import ../base
//import require/global
//import core/object/typeof
//import ../error
//import core/notice

function render_control_setLogic(resContainer) {
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var logic = resContainer.logic;
    var startTime = null;
    var endTime = null;
    var logicCallbackFn;

    resContainer.logicReady = false;
    resContainer.logicFn = null;
    resContainer.logicRunned = false;

    
    if(logic){
        if(core_object_typeof(logic) === 'function'){
            resContainer.logicFn = logic;
            render_control_toStartLogic(resContainer);
        } else {
            var cb = logicCallbackFn = function(fn) {
                if(cb === logicCallbackFn){
                    endTime = now();
                    core_notice_trigger('logicTime', {
                        startTime: startTime,
                        logicTime: endTime - startTime || 0,
                        ctrlNS: controllerNs
                    });
                    fn && (resContainer.logicFn = fn);
                    render_control_toStartLogic(resContainer);
                }
                //抛出js加载完成事件
            };
            startTime = now();
            require_global(logic, cb, render_error, controllerNs);
        }
    }
}

function render_control_toStartLogic(resContainer) {
    resContainer.logicReady = true;
    render_control_startLogic(resContainer);
}

function render_control_startLogic(resContainer) {
    var boxId = resContainer.boxId;
    var box = getElementById(boxId);
    var control = render_base_controlCache[boxId];
    var logicResult;
    var real_data = resContainer.real_data || {};
    if (!resContainer.logicRunned && resContainer.logicFn && resContainer.logicReady && resContainer.rendered) {
        if (isDebug) {
            logicResult = resContainer.logicFn(box, real_data, control) || {};
        } else {
            try {
                logicResult = resContainer.logicFn(box, real_data, control) || {};
            } catch(e) {
                log('Error: run logic error:', resContainer.logic, e);
            }
        }
        resContainer.logicResult = logicResult;
        resContainer.logicRunned = true;
    }
}

/*
 * 销毁logic
*/
function render_control_destroyLogic(resContainer) {
    resContainer.logicRunned = false;
    var logicResult = resContainer.logicResult;
    if (logicResult) {
        if (isDebug) {
            logicResult.destroy && logicResult.destroy();
        } else {
            try {
                logicResult.destroy && logicResult.destroy();
            } catch(e) {
                log('Error: destroy logic error:', resContainer.logic, e);
            }
        }
      resContainer.logicResult = undefined;
    }
}