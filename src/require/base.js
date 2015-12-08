//模块相关全局变量
var require_base_module_deps = {};
var require_base_module_fn = {};
var require_base_module_loaded = {};
var require_base_module_defined = {};
var require_base_module_runed = {};

//事件
var require_base_event_defined = '-require-defined';
var require_global_loadingNum = 0;

function require_base_idFix(id, basePath) {
    if (id.indexOf('.') === 0) {
        id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
    }
    while (id.indexOf('../') !== -1) {
        id = id.replace(/\w+\/\.\.\//, '');
    }
    return id;
}

function require_base_nameToPath(name){
    return name.substr(0, name.lastIndexOf('/') + 1);
}