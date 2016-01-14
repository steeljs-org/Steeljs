//import ../base
//import core/object/typeof
//import resource/res
//import ../error
//import core/object/equals
//import ./toTiggerChildren
//import core/notice
//import router/history
//import ./triggerRendered
//import ./sData

var render_control_setData_dataCallbackFn;

function render_control_setData(resContainer, tplChanged) {
    
    var data = resContainer.data;
    // var isMain = getElementById(resContainer.boxId) === mainBox;
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var startTime = null;
    var endTime = null;
    var real_data;
    // var ajaxRunTime = 10;//计算ajax时间时，运行时间假定需要10ms（实际在10ms内）

    if (data === null || data === 'null') {
        render_control_setData_toRender({}, resContainer, tplChanged);
        return;
    }
    if (!data) {
        return;
    }
    var dataType = core_object_typeof(data);
    
    if (dataType === 'object') {
        render_control_setData_toRender(data, resContainer, tplChanged);
    } else if (dataType === 'string') {
        real_data = render_control_sData_getData(data);
        if (real_data) {
            render_control_setData_toRender(real_data, resContainer, tplChanged);
            return;
        }
        var cb = render_control_setData_dataCallbackFn = function(ret) {
            if (cb === render_control_setData_dataCallbackFn) {
                //拿到ajax数据
                endTime = now();
                core_notice_trigger('ajaxTime', {
                    startTime: startTime,
                    ajaxTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                render_control_setData_toRender(ret.data, resContainer, tplChanged);
            }
        };
        //开始拿模块数据
        startTime = now();
        resource_res.get(data, cb, function(ret){
            resContainer.real_data = null;
            render_error(ret);
        });
    }
}

function render_control_setData_toRender(data, resContainer, tplChanged) {
    resContainer.dataReady = true;
    if (resContainer.forceRender || tplChanged || !core_object_equals(data, resContainer.real_data)) {
        resContainer.real_data = data;
        render_control_render(resContainer);
    } else {
        render_control_triggerRendered(resContainer.boxId);
        render_contorl_toTiggerChildren(resContainer);
    }
}