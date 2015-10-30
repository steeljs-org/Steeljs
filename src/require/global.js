//import ./base
//import ./runner
//import resource/res

//外部异步调用require方法
function require_global(deps, cb, errcb, curNs){
    var ns;
    var loaded = 0;
    var errored = 0;
    var basePath;
    deps = [].concat(deps);
    function call_cb() {
        var runner_result = require_runner(deps);
        cb && cb.apply(this, runner_result);
    }
    for(var i = 0, len = deps.length; i < len; i++){
        ns = deps[i];
        if (curNs) {
            basePath = require_nameToPath(curNs);
            ns = require_idFix(ns, basePath);
            deps[i] = ns;
        }
        
        if(!require_ismodule_defined(ns)){
            resource_res.js(ns, function(){
                loaded++;
                check();
            }, function() {
                errored ++;
            });
        }else {
            loaded++;
        }
    }
    check();
    function check() {
        if (deps.length <= loaded) {
            if (errored) {
                errcb();
            } else {
                call_cb();
            }
        }
    }
}