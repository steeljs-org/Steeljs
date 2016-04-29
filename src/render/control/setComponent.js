//import ../base
//import require/global
//import core/object/typeof
//import ../error
//import ./render
//import core/notice
//import ./triggerError

function render_control_setComponent(resContainer) {
    var controllerNs = render_base_controllerNs[resContainer.boxId];
    var componentCallbackFn;
    var startTime = null;
    var endTime = null;
    var component = resContainer.component;

    resContainer.componentReady = false;
    resContainer.componentFn = null;
    
    if(component){
        if(core_object_typeof(component) === 'function'){
            resContainer.componentFn = component;
            render_control_setComponent_toRender(resContainer);
            return;
        }
        var cb = componentCallbackFn = function(component){
            if(cb === componentCallbackFn){
                endTime = now();
                core_notice_trigger('componentTime', {
                    startTime: startTime,
                    componentTime: endTime - startTime || 0,
                    ctrlNS: controllerNs
                });
                resContainer.component = component;
                render_control_setComponent_toRender(resContainer);
            }
        };
        startTime = now();
        require_global(component, cb, function() {
            render_error();
            render_control_triggerError(resContainer, 'component', component);
        }, controllerNs);
    }
}

function render_control_setComponent_toRender(resContainer) {
    resContainer.componentReady = true;
    render_control_render(resContainer);
}