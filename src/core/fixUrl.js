/*
 * 根据相对路径得到绝对路径
 * @method core_fixUrl
 * @private
 * @return {String}
 */

//import core/parseURL

function core_fixUrl(baseUrl, path) {
    var baseUrlJson = core_parseURL(baseUrl);
    var origin = baseUrlJson.scheme + '://' + baseUrlJson.host;
    var originPath = origin + '/';
    var basePath = baseUrl.slice(0, baseUrl.lastIndexOf('/') + 1);

    if (/https?:\/\/\w+/.test(path)) {
        return path;
    }
    if (path === 'http://') {
        return 'http:';
    }
    if (path === 'http:') {
        return location.href;
    }
    if(path === 'http:/' || path === '/'){
        return originPath;
    }
    if (path === '.') {
        return basePath;
    }
    if (path.indexOf('./') === 0) {
        path = path.replace(/^\.\//, '');
        return basePath + path;
    }
    if (path === '..') {
        // return 
        path = path.replace(/\.\./, '');
        basePath = core_fixUrl_handleTwoDots(basePath);
        return basePath + path;
    }
    if (/^\/[^\/]+/.test(path)) {
        return origin + path;
    }
    while (path.indexOf('../') === 0) {
        if (originPath === basePath) {
            path = path.replace(/(\.\.\/)/g, '');
            basePath = originPath;
            break;
        }
        path = path.replace(/^\.\.\//, '');
        basePath = core_fixUrl_handleTwoDots(basePath);
    }
    return basePath + path;
}

function core_fixUrl_handleTwoDots(url) {
    url = url.charAt(url.length -1) === '/' ? (url.slice(0, url.length -1)) : url;
    return url.slice(0, url.lastIndexOf('/') + 1);
}