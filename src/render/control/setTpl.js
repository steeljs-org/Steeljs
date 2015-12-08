//import ../base
//import require/global
//import core/object/typeof
//import ../error
//import ./render
//import core/notice

function render_control_setTpl(resContainer) {
    var controllerNs = resContainer.controllerNs;
    var tplCallbackFn;
    var startTime = null;
    var endTime = null;
    var tpl = resContainer.tpl;

    resContainer.tplFn = null;
    
    if(tpl){
        if(core_object_typeof(tpl) === 'function'){
            resContainer.tplFn = tpl;
            render_control_setTpl_toRender(resContainer);
            return;
        }
        var cb = tplCallbackFn = function(jadefn){
            if(cb === tplCallbackFn){
                endTime = new Date;
                core_notice_trigger('tplTime', {
                    startTime: startTime,
                    tplTime: endTime - startTime || 0,
                    ctrlNS: controllerNs
                });
                resContainer.tplFn = jadefn;
                render_control_setTpl_toRender(resContainer);
            }
        }
        startTime = new Date;
        
        require_global(tpl, cb, render_error, controllerNs);
    }
}

function render_control_setTpl_toRender(resContainer) {
    resContainer.tplReady = true;
    render_control_render(resContainer);
}