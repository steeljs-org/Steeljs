//import core/parseURL
//import core/fixUrl
//import ./base

function router_parseURL(url) {
    //这里只是针对url做路径处理，默认的也是hash中解析出来的url或者是base里的url；@shaobo3
    url = url || router_base_useHash?router_hash_parse().url:location.toString();
    var result = core_parseURL(url);
    return result;
}