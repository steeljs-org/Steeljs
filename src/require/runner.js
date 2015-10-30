//import ./base
//import ./global
//import core/array/makeArray

//内部同步调用require方法
function require_runner_makeRequire(curNs) {
    var basePath = require_nameToPath(curNs);
    return require;

    function require(ns){
        if (toString.call(ns).toLowerCase().indexOf('array') != -1) {
            var paramList = core_array_makeArray(arguments);
            paramList[3] = paramList[3] || curNs;
            return require_global.apply(this, paramList);
        }
        ns = require_idFix(ns, basePath);

        if (!require_ismodule_defined(ns)) {
            throw '[' + ns + '] 依赖未定义!';
        }
        return require_runList[ns];
    }
}

//运行define列表，并返回实例集
function require_runner(pkg, basePath) {
    // log('%cpkg_runner', 'color:green;font-size:20px;');
    pkg = [].concat(pkg);
    var i, len;
    var ns, nsConstructor, module;
    var resultList = [];

    for (i = 0, len = pkg.length; i < len; i++) {
        ns = pkg[i];
        ns = require_idFix(ns, basePath);
        nsConstructor = require_defineConstrutors[ns];
        if(!nsConstructor){
            log('Exception: please take notice of your resource  "', ns, '"  is right or not.(especial the upper/lower case)');
            resultList.push(undefined);
        }else {
            if (!require_ismodule_runed(ns)) {
                if(require_defineDeps[ns]){
                    require_runner(require_defineDeps[ns], require_nameToPath(ns));
                }
                module = {
                    exports: {}
                };
                require_runList[ns] = nsConstructor.apply(window, [require_runner_makeRequire(ns), module.exports, module]) || module.exports;
            }
            resultList.push(require_runList[ns]);
        }
    }
    return resultList;
}