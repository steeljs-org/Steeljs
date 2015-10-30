//import ../base
//import core/object/typeof
//import resource/res
//import ../error
//import core/object/equals
//import ./toTiggerChildren
//import core/notice

function render_control_setData(resContainer) {
    
    var dataCallbackFn;
    var data = resContainer.data;
    var controllerNs = resContainer.controllerNs;
    var startTime = null;
    var endTime = null;
    // var ajaxRunTime = 10;//计算ajax时间时，运行时间假定需要10ms（实际在10ms内）

    if (data === null || data === 'null') {
        render_control_setData_toRender({}, resContainer);
        return;
    }
    if (!data) {
        return;
    }
    var dataType = core_object_typeof(data);
    
    if (dataType === 'object') {
        render_control_setData_toRender(data, resContainer);
    } else if (dataType === 'string') {
        var cb = dataCallbackFn = function(ret) {
            if (cb === dataCallbackFn) {
                //拿到ajax数据
                endTime = new Date;
                core_notice_fire('ajaxTime', {
                    startTime: startTime,
                    ajaxTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                // toRender(ret.data);//||
                render_control_setData_toRender(ret.data, resContainer);
            }
        };
        // resource_res.get(data, cb, render_error);
        //开始拿模块数据
        startTime = new Date;
        resource_res.get(data, cb, function(ret){
            resContainer.data = ret || null;
            resContainer.real_data = resContainer.data;
            render_error(ret);
        });
    }
}

function render_control_setData_toRender(data, resContainer) {
    resContainer.dataReady = true;
    if (resContainer.forceRender || !core_object_equals(data, resContainer.real_data)) {
        resContainer.real_data = data;
        render_control_render(resContainer);
    } else {
        render_contorl_toTiggerChildren(resContainer);
    }
}