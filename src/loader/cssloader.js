//import core/dom/createElement
//import core/dom/setAttribute
//import core/dom/removeNode
//import core/uniqueKey
//import core/hideDiv
//import resource/queue

function loader_css(url, callback, load_ID) {
    var load_div = null;
    var domID = core_uniqueKey();
    var timer = null;
    var _rTime = 500;//5000毫秒

    load_div = core_dom_createElement('div');
    core_dom_setAttribute(load_div, 'id', load_ID);
    core_hideDiv_appendChild(load_div);
    
    if (check()) {
        return;
    }
    var link = core_dom_createElement('link');
    core_dom_setAttribute(link, 'rel', 'Stylesheet');
    core_dom_setAttribute(link, 'type', 'text/css');
    core_dom_setAttribute(link, 'charset', 'utf-8');
    core_dom_setAttribute(link, 'id', 'link_' + load_ID);
    core_dom_setAttribute(link, 'href', url);
    head.appendChild(link);

    timer = function() {
        if (check()) {
            return;
        }
        if (--_rTime > 0) {
            setTimeout(timer, 10);
        } else {
            log('Error: css("' + url + '" timeout!');
            core_hideDiv_removeChild(load_div);
            callback(false);
        }
    };
    setTimeout(timer, 50);
    function check() {
        var result = parseInt(window.getComputedStyle ? getComputedStyle(load_div, null)['height'] : load_div.currentStyle && load_div.currentStyle['height']) === 42;
        if (result) {
            load_div && core_hideDiv_removeChild(load_div);
            callback(true);
        }
        return result;
    }
}

function loader_css_remove(load_ID) {
    var linkDom = getElementById('link_' + load_ID);
    if (linkDom) {
        core_dom_removeNode(linkDom);
        return true;
    }
    return false;
}