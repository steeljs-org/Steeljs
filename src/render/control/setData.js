//import ../base
//import core/object/typeof
//import resource/res
//import ../error
//import core/object/equals
//import ./toTiggerChildren
//import core/notice

function render_control_setData(resContainer, tplChanged) {
    
    var dataCallbackFn;
    var data = resContainer.data;
    var controllerNs = render_base_controllerNs[resContainer.boxId];
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
        render_control_setData_toRender(data, resContainer, tplChanged);
    } else if (dataType === 'string') {
        var cb = dataCallbackFn = function(ret) {
            if (cb === dataCallbackFn) {
                //拿到ajax数据
                endTime = now();
                core_notice_trigger('ajaxTime', {
                    startTime: startTime,
                    ajaxTime: (endTime - startTime) || 0,
                    ctrlNS: controllerNs
                });
                // toRender(ret.data);//||
                render_control_setData_toRender(ret.data, resContainer, tplChanged);
            }
        };
        // resource_res.get(data, cb, render_error);
        //开始拿模块数据
        startTime = now();
        resource_res.get(data, cb, function(ret){
            resContainer.data = ret || null;
            resContainer.real_data = resContainer.data;
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
        render_contorl_toTiggerChildren(resContainer);
    }
}