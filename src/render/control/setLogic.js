//import ../base
//import require/global
//import core/object/typeof
//import ../error
//import core/notice

function render_control_setLogic(resContainer) {
    var controllerNs = resContainer.controllerNs;
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
                    endTime = new Date;
                    core_notice_fire('logicTime', {
                        startTime: startTime,
                        logicTime: endTime - startTime || 0,
                        ctrlNS: controllerNs
                    });
                    fn && (resContainer.logicFn = fn);
                    render_control_toStartLogic(resContainer);
                }
                //抛出js加载完成事件
            }
            startTime = new Date;
            require_global(logic, cb, render_error, controllerNs);
        }
    }
}

function render_control_toStartLogic(resContainer) {
    resContainer.logicReady = true;
    render_control_startLogic(resContainer);
}

function render_control_startLogic(resContainer) {
    var box = getElementById(resContainer.boxId);
    var logicResult;
    var real_data = resContainer.real_data || {};
    if (!resContainer.logicRunned && resContainer.logicFn && resContainer.logicReady && resContainer.rendered) {
        if (isDebug) {
            logicResult = resContainer.logicFn(box, real_data) || {};
        } else {
            try {
                logicResult = resContainer.logicFn(box, real_data) || {};
            } catch(e) {
                log('run logic error:', resContainer.logic, e);
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
                log('destroy logic error:', resContainer.logic, e);
            }
        }
      resContainer.logicResult = undefined;
    }
}