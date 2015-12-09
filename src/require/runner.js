//import ./base
//import ./global
//import core/array/makeArray
//import core/object/typeof
//import core/nameSpaceFix
//import core/urlFolder

//内部同步调用require方法
function require_runner_makeRequire(currNs) {
    var basePath = core_urlFolder(currNs);
    return require;

    function require(ns) {
        if (core_object_typeof(ns) === 'array') {
            var paramList = core_array_makeArray(arguments);
            paramList[3] = paramList[3] || currNs;
            return require_global.apply(window, paramList);
        }
        ns = core_nameSpaceFix(ns, basePath);

        if (!require_base_module_defined[ns]) {
            throw 'Error: ns("' + ns + '") is undefined!';
        }
        return require_base_module_runed[ns];
    }
}

//运行define列表，并返回实例集
function require_runner(pkg, basePath) {
    pkg = [].concat(pkg);
    var i, len;
    var ns, nsConstructor, module;
    var resultList = [];

    for (i = 0, len = pkg.length; i < len; i++) {
        ns = core_nameSpaceFix(pkg[i], basePath);
        nsConstructor = require_base_module_fn[ns];
        if (!nsConstructor) {
            log('Warning: ns("' + ns + '") has not constructor!');
            resultList.push(undefined);
        } else {
            if (!require_base_module_runed[ns]) {
                if (require_base_module_deps[ns]) {
                    require_runner(require_base_module_deps[ns], core_urlFolder(ns));
                }
                module = {
                    exports: {}
                };
                require_base_module_runed[ns] = nsConstructor.apply(window, [require_runner_makeRequire(ns), module.exports, module]) || module.exports;
            }
            resultList.push(require_base_module_runed[ns]);
        }
    }
    return resultList;
}