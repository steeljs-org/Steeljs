//import base
//import core/dom/ready
//import core/event/addEventListener
//import core/event/preventDefault
//import ./match
//import ./history
//import ./hash
//import ./router
//import render/run
//import core/notice
//import core/fixUrl
//import core/crossDomainCheck

//@Finrila 未处理hashchange事件

var router_listen_queryTime = 5;
var router_listen_count;
var router_listen_lastStateIndex = undefined;

function router_listen() {
    //@shaobo3---
    router_listen_lastStateIndex = router_base_useHash?
        router_hash_getStateIndex():
        router_history_getStateIndex();
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
        //使用hash模式，如何带hash新开页
        if (!href || href.indexOf('javascript:') === 0 || hrefNode.getAttribute("target") === "_blank" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
            return;
        }
        core_event_preventDefault(e);
        router_base_noHistoryChange = true;
        router_router_set(href);
        router_listen_lastStateIndex = router_base_useHash?
            router_hash_getStateIndex():
            router_history_getStateIndex();
    });
    var popstateTime = 0;
    //非hash模式，侦听popstate事件
    !router_base_useHash && core_event_addEventListener(window, 'popstate', function() {
        core_notice_trigger('popstate');
        var currentStateIndex = router_history_getStateIndex();
        if (router_listen_lastStateIndex > currentStateIndex) {
            if (router_base_routerType === 'refresh') {
                router_base_routerType = 'back-refresh';
            } else {
                router_base_routerType = 'back';
            }
        } else {
            router_base_routerType = 'forward';
        }
        router_listen_lastStateIndex = currentStateIndex;
        var href = location.href;
        if (popstateTime === 0 && router_base_currentHref === href) {
            return;
        }
        router_listen_handleHrefChenged(href);
    });
    //hash模式，侦听hashchange事件
    router_base_useHash && core_event_addEventListener(window, 'hashchange', function(e){
        console.log('000, hashchange');
        console.log("Event>>>",e);
        if (router_base_noHistoryChange) {
            router_base_noHistoryChange = false;
            return;
        }
        if (router_base_noHistoryChange_set) {
            router_base_noHistoryChange_set = false;
            return;
        }
        console.log('11111, hashchange');
        core_notice_trigger('hashchange');
        var currentStateIndex = router_hash_getStateIndex();
        if (router_listen_lastStateIndex > currentStateIndex) {
            router_base_routerType = 'back';
        } else {
            router_base_routerType = 'forward';
        }
        router_listen_lastStateIndex = currentStateIndex;
        var href = router_hash_parse().url;
        if (popstateTime === 0 && router_base_currentHref === href) {
            return;
        }
        router_listen_handleHrefChenged(href);
    });
    //popstate 事件在第一次被绑定时也会触发，但不是100%，所以加了个延时
    setTimeout(function() {
        popstateTime = 1;
    }, 1000);
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
    //@shaobo3---
    //TODO::为什么在这里还要设置一次，hash模式下陷入循环，导致三次hashchange
    if (router_base_useHash) {
        router_hash_state_set(router_router_prevHref_key, router_base_prevHref);
    } else {
        router_history_state_set(router_router_prevHref_key, router_base_prevHref);
    }
    router_base_currentHref = url;
    //@shaobo3---
    router_listen_lastStateIndex = router_base_useHash?
        router_hash_getStateIndex():
        router_history_getStateIndex();
    if (router_router_get(true).config) {
        router_listen_fireRouterChange();
    } else {
        location.reload();
    }
}

//派发routerChange事件，返回router变化数据 @shaobo3
function router_listen_fireRouterChange() {
    //TODO::原则上这里是单次路由的末尾，但是因为hash改变，又重新走了一次，setFlag失效
    //TODO::使用延时大法，修复；
    //window.setTimeout(function(){
    //    router_base_noHistoryChange = false;
    //}, 300);
    core_notice_trigger('routerChange', router_router_get());
}