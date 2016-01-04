//import core/parseURL
//import core/queryToJson
//import core/URL
//import ./base
//import core/fixUrl
//import router/router

function resource_fixUrl(url, type) {

    switch(type) {
        case 'js':
            path = resource_jsPath;
            break;
        case 'css':
            path = resource_cssPath;
            break;
        case 'ajax':
            path = resource_ajaxPath;
    }

    var currentRouter = router_router_get();
     
    //匹配参数{id} -> ?id=2
    // var urlMatch = url.match(/\{(.*?)\}/g);
    if (type === 'ajax') {
        var urlParams = {};
        var hrefParams = currentRouter.query;
        url = url.replace(/\{(.*?)\}/g, function(_, name) {
            if (hrefParams[name]) {
                urlParams[name] = hrefParams[name];
            }
            return '';
        });
        url = core_URL(url).setParams(urlParams).toString();
        url = url.charAt(0) === '/' ? url.slice(1) : url;
    }

    var result = resource_fixUrl_handle(path, url, resource_basePath, currentRouter.url.replace(/\/([^\/]+)$/, '/'));
    if ((type === 'js' || type === 'css') && !RegExp('(\\.' + type + ')$').test(url)) {
        result += '.' + type;
    }
    return result;
}

function resource_fixUrl_handle(path, url, basePath, hrefPath) {
    return core_fixUrl(path || basePath || hrefPath, url);
}