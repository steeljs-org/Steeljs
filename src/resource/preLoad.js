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
        var preloadData = scripts[i].getAttribute('s-preload-data');
        var preloadDataProperty = scripts[i].getAttribute('s-preload-data-property');
        if (preloadData) {
            preloadData = preloadData.replace(/&amp;/gi, '&');
            resource_preLoad_bootLoad_data(preloadData, preloadDataProperty);
        }
    }
}

function resource_preLoad_bootLoad_data(url, property) {
    resource_preLoad_setRes(url, 'ajax', false);
    check();
    function check() {
        if (property in window) {
            var resource = resource_preLoad_resMap[url];
            resource.complete = true;
            var response = window[property];
            var success = resource_request_apiRule(url, response, {}, function(success, response) {
                var callbackList = resource[success ? 'onsuccess' : 'onfail'];
                resource[success ? 'success' : 'fail'] = response;
                for (var i = 0, l = callbackList.length; i < l; i++) {
                    callbackList[i] && callbackList[i](response);
                }
            });
            
        } else {
            setTimeout(check, 19);
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

// /**
//  * 资源预加载
//  * @param  {array} resArray 资源数组 [{url, type}]
//  * @return {undefined}   
//  */
// function resource_preLoad(resArray) {
//     if (router_router_get().type === 'init') {
//         if (core_array_isArray(resArray)) {
//             for (var i = resArray.length - 1; i >= 0; i--) {
//                 var res = resArray[i];
//                 resource_preLoad_resMap[res.url] = {
//                     type: res.type,
//                     complete: false
//                 };
//             }
//         }
//         for(var url in resource_preLoad_resMap) {
//             resource_preLoad_doLoad(url);
//         }
//     }
// }

/**
 * 得到预加载的资源
 * @param  {string} url 
 */
function resource_preLoad_get(url) {
    return resource_preLoad_resMap[url];
}

// /**
//  * 加载
//  */
// function resource_preLoad_doLoad(url) {
//     var urlObj = resource_preLoad_resMap[url];
//     resource_res_do(urlObj.type, url, function() {
//         urlObj.complete = true;
//         urlObj.success = arguments;
//     }, function() {
//         urlObj.complete = true;
//         urlObj.fail = arguments;
//     }, urlObj.type === 'css' ? resource_res_getCssId(url) : '');
// }