//import ./res
//import ./request
//import router/router

var resource_preLoad_resMap = {};

/**
 * 支持两种资源的预加载
 * css: link节点 s-preload-css="name1|name2|name3"
 *     例如：<link s-preload-css="page/index" href="http://a.com/css/page/index.css?version=x" type="text/css" rel="stylesheet">
 * data: script节点 s-preload-data="name1|name2|name3"
 *     例：
 *        1. jsonp方式
 *           <script s-preload-data="/aj/index?page=2" s-preload-data-property="index_data" type="text/javascript">
 *               function index_callback(data) {
 *                   index_data = data;
 *               }
 *           </script>
 *           <script type="text/javascript" src="http://a.com/aj/index?page=2&callback=index_callback" async="async"></script>
 *        2. ajax方式
 *           <script s-preload-data="/aj/index?page=2" s-preload-data-property="index_data" type="text/javascript">
 *               //ajax方法定义
 *               ajax('/aj/index?page=2', function(data) {
 *                   index_data = data;
 *               }, function() {
 *                   index_data = false;
 *               })
 *           </script>
 */
function resource_preLoad_bootLoad() {
    var links = getElementsByTagName('link');
    for (var i = links.length - 1; i >= 0; i--) {
        var preloadCss = links[i].getAttribute('s-preload-css');

        if (preloadCss) {
            preloadCss = preloadCss.replace(/&amp;/gi, '&');
            var cssUrls = preloadCss.split('|');
            for (var j = cssUrls.length - 1; j >= 0; j--) {
                resource_preLoad_setRes(cssUrls[j], 'css', true, true);
            }
        }
    }
    var scripts = getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        var preloadData = script.getAttribute('s-preload-data');
        var preloadDataProperty = script.getAttribute('s-preload-data-property');
        if (preloadData) {
            preloadData = preloadData.replace(/&amp;/gi, '&');
            resource_preLoad_bootLoad_data(preloadData, preloadDataProperty);
        }
    }
}

function resource_preLoad_bootLoad_data(url, property) {
    resource_preLoad_setRes(url, 'ajax', false);
    var checkTime = 250;//250*19 超时时间
    var resource = resource_preLoad_resMap[url];
    check();
    function check() {
        if (!resource || resource.complete) {
            return;
        }
        if (property in window) {
            resource.complete = true;
            var response = window[property];
            if (response === 'error') {
                callback(false, null);
            } else {
                resource_request_apiRule(url, response, {}, function(success, response) {
                    callback(success, response);
                });
            }
        } else {
            if (checkTime > 0) {
                setTimeout(check, 19);
            } else {
                resource.complete = true;
                callback(false, null);
            }
        }
        checkTime--;
    }
    function callback(success, response) {
        var callbackList = resource[success ? 'onsuccess' : 'onfail'];
        resource[success ? 'success' : 'fail'] = response;
        for (var i = 0, l = callbackList.length; i < l; i++) {
            if (callbackList[i]) {
                callbackList[i](response);
            }
        }
    }
}

function resource_preLoad_setRes(url, type, complete, success, fail) {
    resource_preLoad_resMap[url] = {
        type: type,
        complete: complete,
        success: success,
        fail: fail,
        onsuccess: [],
        onfail: []
    };
}

/**
 * 得到预加载的资源
 * @param  {string} url 
 */
function resource_preLoad_get(url) {
    return resource_preLoad_resMap[url];
}
