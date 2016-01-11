//import base
//import core/dom/ready
//import core/event/addEventListener
//import core/event/preventDefault
//import ./match
//import ./history
//import ./router
//import render/run
//import core/notice
//import core/fixUrl
//import core/crossDomainCheck

var router_listen_queryTime = 5;
var router_listen_count;
var router_listen_lastStateIndex = undefined;
var router_listen_poptime = 0;

function router_listen() {
    router_listen_lastStateIndex = router_history_getStateIndex();
    //绑定link
    core_event_addEventListener(document, 'click', router_listen_clickHandler);
    //绑定浏览器（前进 & 后退）事件
    if (router_base_useHash) {
        core_event_addEventListener(window, 'hashchange', router_listen_hashchangeHandler);
    } else {
        core_event_addEventListener(window, 'popstate', router_listen_popstateHandler);
    }
    //popstate 事件在第一次被绑定时也会触发，但不是100%，所以加了个延时
    setTimeout(function() { router_listen_poptime = 1;}, 1000);
}

function router_listen_clickHandler(e){
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
    router_router_set(href);
    router_listen_lastStateIndex = router_history_getStateIndex();
}

function router_listen_popstateHandler(e){
    var _url = location.href;
    router_listen_eventHandler(_url);
}

function router_listen_hashchangeHandler(e){
    console.log("router_base_dataSetFlag>>>", router_base_dataSetFlag);
    console.log("router_base_routerSetFlag>>>", router_base_routerSetFlag);
    if (router_base_dataSetFlag) {
        router_base_dataSetFlag = false;
        return;
    }
    if (router_base_routerSetFlag) {
        router_base_routerSetFlag = false;
        return;
    }
    console.log("***************hashchange");
    var _url = router_hash_parse().url;
    router_listen_eventHandler(_url);
}

function router_listen_eventHandler(url){
    core_notice_trigger('pophistory');
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
    if (router_listen_poptime === 0 && router_base_currentHref === url) {
        return;
    }
    router_listen_handleRouterChanged(url);
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

function router_listen_handleRouterChanged(url) {
    console.log("@@@@@@@@@@@@@@@router_listen_handleRouterChanged");
    router_base_prevHref = router_base_currentHref;
    router_history_state_set(router_router_prevHref_key, router_base_prevHref);
    router_base_currentHref = url;
    router_listen_lastStateIndex = router_history_getStateIndex();
    if (router_router_get(true).config) {
        router_listen_fireRouterChange();
    } else {
        location.reload();
    }
}

//派发routerChange事件，返回router变化数据 @shaobo3
function router_listen_fireRouterChange() {
    core_notice_trigger('routerChange', router_router_get());
}