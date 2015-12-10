//import core/parseURL
//import core/fixUrl
//import ./base

function router_parseURL(url) {
    url = url || location.toString();
    var result = core_parseURL(url);
    var hash = result.hash;
    if (router_base_useHash && hash) {
        //获取当前 hash后的 path
        result = core_parseURL(core_fixUrl(url, hash));
    }
    return result;
}