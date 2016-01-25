//import ./base
//import ./runner
//import resource/res
//import core/notice
//import core/notice
//import core/nameSpaceFix
//import core/urlFolder
//import core/hasProtocol

//外部异步调用require方法
function require_global(deps, complete, errcb, currNs, runDeps) {
    var depNs;
    var depDefined = 0;
    var errored = 0;
    var baseModulePath = currNs && core_urlFolder(currNs);
    deps = [].concat(deps);
    for (var i = 0, len = deps.length; i < len; i++) {
        depNs = deps[i] = core_nameSpaceFix(deps[i], baseModulePath);
        if (require_base_module_loaded[depNs]) {
            checkDepDefined(depNs);
        } else {
            ! function(depNs) {
                resource_res.js(depNs, function() {
                    if (core_hasProtocol(depNs)) {
                        require_base_module_defined[depNs] = true;
                        require_base_module_loaded[depNs] = true;
                    }
                    checkDepDefined(depNs);
                }, function() {
                    errored++;
                });
            }(depNs);
        }
    }

    function check() {
        if (deps.length <= depDefined) {
            if (errored) {
                errcb();
            } else {
                var runner_result = [];
                if (runDeps === undefined || runDeps === true) {
                    runner_result = require_runner(deps);
                }
                complete && complete.apply(window, runner_result);
            }
        }
    }

    function checkDepDefined(depNs) {
        if (require_base_module_defined[depNs]) {
            depDefined++;
            check();
        } else {
            core_notice_on(require_base_event_defined, function definedFn(ns) {
                if (depNs === ns) {
                    core_notice_off(require_base_event_defined, definedFn);
                    depDefined++;
                    check();
                }
            });
        }
    }
}