//import ./base

//调用入口的获取
function require_dataMain(){
    var scripts = getElementsByTagName('script');
    var lastScripts = scripts[scripts.length -1];
    require_dataMainId = lastScripts && lastScripts.getAttribute('data-main') || require_dataMainId;
}