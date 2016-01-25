//import core/fixUrl
//import ./fixUrl
//import core/hasProtocol
//import ./queue
//import ./preLoad
//import loader/jsloader
//import loader/cssloader
//import resource/request

var resource_res_cssPrefix = 'S_CSS_';

var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle('js', name, succ, err);
    },
    css: function(name, succ, err) {
        resource_res_handle('css', name, succ, err);
    },
    get: function(name, succ, err) {
        resource_res_handle('ajax', name, succ, err);
    },
    removeCss: function(name) {
        return loader_css_remove(resource_res_getCssId(name));
    }
};

function resource_res_handle(type, name, succ, err) {
    var nameObj = resource_preLoad_get(name);
    log('Info:', name, !!nameObj);
    if (router_router_get().type === 'init' && nameObj) {
        if (nameObj.complete) {
            if (nameObj.success) {
                succ && succ.apply(undefined, [].concat(nameObj.success));
            } else {
                err && err.apply(undefined, [].concat(nameObj.fail));
            }
        } else {
            nameObj.onsuccess.push(succ);
            nameObj.onfail.push(err);
        }
    } else {
        resource_res_do(type, name, succ, err);
    }
}

function resource_res_do(type, name, succ, err) {
    var cssId;
    if (type === 'css') {
        cssId = resource_res_getCssId(name);
    }
    var hasProtocol = core_hasProtocol(name);
    var url = name, loader;
    if (!hasProtocol) {
        url = resource_fixUrl(name, type);
        if (type !== 'ajax' && resource_base_version) {
            url += '?version=' + resource_base_version;
        }
    }
    if(resource_queue_list[url]) {
        resource_queue_push(url, succ, err);
    } else {
        resource_queue_create(url);
        resource_queue_push(url, succ, err);
        switch(type) {
            case 'js':
                loader_js(url, callback);
                break;
            case 'css':
                loader_css(url, callback, cssId);
                break;
            case 'ajax':
                resource_request(url, callback);
                break;
        }
    }
    function callback(access, data) {
        resource_queue_run(url, access, data);
        resource_queue_del(url);
    }
}

function resource_res_getCssId(path) {
    return path && resource_res_cssPrefix + path.replace(/(\.css)$/i, '').replace(/\//g, '_');
}