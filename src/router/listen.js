//import base
//import core/dom/ready
//import core/event/addEventListener
//import core/event/preventDefault
//import ./match
//import render/run
//import core/notice
//import core/fixUrl
//import core/crossDomainCheck

//@Finrila 未处理hashchange事件

var router_listen_queryTime = 5;
var router_listen_count;
var router_listen_lastStateData = undefined;

function router_listen() {
    router_listen_lastStateData = history.state || 0;
    //绑定link
    core_event_addEventListener(document, 'click', function(e) {
        //e.target 是a 有.href　下一步，或者不是a e.target.parentNode
        //向上查找三层，找到带href属性的节点，如果没有找到放弃，找到后继续
        var el = e.target;
        router_listen_count = 1;
        var hrefNode = router_listen_getHrefNode(el);
        var href = hrefNode && hrefNode.href;
        //如果A连接有target=_blank或者用户同时按下command(新tab打开)、ctrl(新tab打开)、alt(下载)、shift(新窗口打开)键时，直接跳链。
        //@shaobo3  （此处可以优化性能@Finrila）
        if (!href || href.indexOf('javascript:') === 0 || hrefNode.getAttribute("target") === "_blank" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }
        core_event_preventDefault(e);
        router_listen_setRouter(href);
    });
    var popstateTime = 0;
    core_event_addEventListener(window, 'popstate', function() {
        if (router_listen_lastStateData > (history.state || 0)) {
            router_base_routerType = 'back';
        } else {
            router_base_routerType = 'forward';
        }
        router_listen_lastStateData = history.state || 0;
        var href = location.href;
        if (popstateTime === 0 && router_base_currentHref === href) {
            return;
        }
        router_listen_handleHrefChenged(href);
    });
    setTimeout(function() {
        popstateTime = 1;
    }, 1000);
    //popstate 事件在第一次被绑定时也会触发，但不是100%，所以加了个延时
}

function router_listen_getHrefNode(el) {
    if (el && router_listen_count < router_listen_queryTime) {
        router_listen_count++;
        if (el.tagName && el.tagName.toLowerCase() === 'a') {
            return el;
        }
        return router_listen_getHrefNode(el.parentNode);
    }
}

function router_listen_handleHrefChenged(url) {
    router_base_prevHref = router_base_currentHref;
    router_base_currentHref = url;
    router_base_params = router_makeParams(url);
    var controller = router_match(url);
    if (controller !== false) {
        router_listen_fireRouterChange(controller);
    } else {
        location.reload();
    }
}

function router_listen_setRouter(url, replace) {
    var basePath = location.href;
    url = core_fixUrl(basePath, url);
    
    if (android && history.length === 1 || !core_crossDomainCheck(url)) {
        if (replace) {
            location.replace(url);
        } else {
            location.href = url;
        }
    } else {
        if (replace) {
            router_base_routerType = 'replace';
            history.replaceState(router_listen_lastStateData, null, url);
        } else {
            if (router_base_currentHref !== url) {
                router_base_routerType = 'new';
                history.pushState(++router_listen_lastStateData, null, url);
            } else {
                router_base_routerType = 'refresh';
            }
        }
        router_listen_handleHrefChenged(url);
    }
}

//派发routerChange事件，返回router变化数据 @shaobo3
function router_listen_fireRouterChange(controller) {
    core_notice_fire('routerChange', {
        controller: controller,
        changeType: router_base_routerType
    });
}