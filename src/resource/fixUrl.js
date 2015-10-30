//import core/parseURL
//import core/queryToJson
//import core/URL
//import ./base
//import core/fixUrl

function resource_fixUrl(url, type) {
    // var path = (type === 'css' ? resource_cssPath : resource_jsPath);

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

     
    var hrefJson = core_parseURL(location.href);
    var hrefPath = location.protocol + '//' + location.host + hrefJson.path;
    hrefPath = hrefPath.replace(/\/([^\/]+)$/, '/');
    //匹配参数{id} -> ?id=2
    // var urlMatch = url.match(/\{(.*?)\}/g);
    if (type === 'ajax') {
        var urlParams = {};
        var hrefParams = core_queryToJson(hrefJson.query);
        url = url.replace(/\{(.*?)\}/g, function(_, name) {
            if (hrefParams[name]) {
                urlParams[name] = hrefParams[name];
            }        
            return '';
        });
        url = core_URL(url).setParams(urlParams).toString();
        url = url.charAt(0) === '/' ? url.slice(1) : url;
    }
    return resource_fixUrl_handle(path, url, resource_basePath, hrefPath);
}

function resource_fixUrl_handle(path, url, basePath, hrefPath) {
    var path = path || basePath || hrefPath;

    return core_fixUrl(hrefPath, path + url);
}

/*function a = function(_baseUrl, _path) {
    if (_path.indexOf('../') = 0) {
        _path = _path.replace(/^\.\.\//, '');
        _baseUrl = resource_fixUrl_handleTwoDots(_baseUrl);
        a(_path)
    }
    return _baseUrl + _path;
}*/
/*function resource_fixUrl_toAbsURL(url){
    var directlink = resource_fixUrl_directlink(url);

    if (url === '') {
        var div = core_dom_createElement('div');
        div.innerHTML = '<a href="' + url.replace(/"/g, '%22') + '"/>';
        return div.firstChild.href;
    } 

    return directlink;
};

function resource_fixUrl_directlink(url) {
    var a = resource_fixUrl_a || core_dom_createElement('a');
    a.href = url;
    return a.href;
}*/