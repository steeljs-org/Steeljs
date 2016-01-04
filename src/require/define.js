//import ./base
//import ./runner
//import ./global
//import core/notice

//全局define
function require_define(ns, deps, construtor) {
    if (require_base_module_defined[ns]) {
        return;
    }
    require_base_module_loaded[ns] = true;
    require_base_module_deps[ns] = construtor ? (deps || []) : [];
    require_base_module_fn[ns] = construtor || deps;
    deps = require_base_module_deps[ns];
    
    if (deps.length > 0) {
        setTimeout(function() {
            require_global(deps, doDefine, function() {
                log('Error: ns("' + ns + '") deps loaded error!', '');
            }, ns, false);
        });
    } else {
        doDefine();
    }
    function doDefine() {
        require_base_module_defined[ns] = true;
        core_notice_trigger(require_base_event_defined, ns);
        log('Debug: define ns("' + ns + '")');
    }
}