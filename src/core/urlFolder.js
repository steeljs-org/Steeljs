/**
 * 获取 url 的目录地址
 */

function core_urlFolder(url){
    return url.substr(0, url.lastIndexOf('/') + 1);
}