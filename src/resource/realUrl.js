//假设在这里读取ajax的config
var ajax_config = {
    'aj1': 'aj3[key1]',
    'aj2': 'aj3[key2]',
    'aj3': 'aj5[key3]',
    'aj5': 'real aj'
};

function resource_realUrl(url, keys) {
    if (!ajax_config[url]) return url;

    var realUrl = ajax_config[url].replace(/\[((.+?))\]/g, function (a, b){
        keys.push(b);
        return '';
    });

    if(realUrl == ajax_config[url]) return realUrl;

    return resource_realUrl(realUrl, keys);
}