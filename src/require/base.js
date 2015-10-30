//已定义的模块容器
var require_defineDeps = {};
var require_defineConstrutors = {};


//已运行的模块容器
var require_runList = {};

//自执行的ns
var require_dataMainId;
var require_mainTimer;
var require_global_loadingNum = 0;

//是否定义
function require_ismodule_defined(ns) {
    return !!require_defineDeps[ns];
}

//是否运行过
function require_ismodule_runed(ns) {
    return ns in require_runList;
}

function require_idFix(id, basePath) {
    if (id.indexOf('.') == 0) {
        id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
    }
    while (id.indexOf('../') != -1) {
        id = id.replace(/\w+\/\.\.\//, '');
    }
    return id;
}

function require_nameToPath(name){
    return name.substr(0, name.lastIndexOf('/') + 1);
}