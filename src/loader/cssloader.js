//import core/dom/createElement
//import core/dom/setAttribute
//import core/uniqueKey
//import core/hideDiv
//import resource/queue

function loader_css( url, callback, load_ID ){
    var link = core_dom_createElement('link');
    var load_div = null;
    var domID = core_uniqueKey();
    var timer = null;
    var _rTime = 3000;

    core_dom_setAttribute(link, 'rel', 'Stylesheet');
    core_dom_setAttribute(link, 'type', 'text/css');
    core_dom_setAttribute(link, 'charset', 'utf-8');
    core_dom_setAttribute(link, 'id', 'link_' + load_ID);
    core_dom_setAttribute(link, 'href', url);
    head.appendChild(link);
    load_div = core_dom_createElement('div');
    core_dom_setAttribute(load_div, 'id', load_ID);
    core_hideDiv_appendChild(load_div);
    
    timer = function(){
        if(parseInt(window.getComputedStyle ? getComputedStyle(load_div, null)['height'] : load_div.currentStyle && load_div.currentStyle['height']) === 42){
            core_hideDiv_removeChild(load_div);
            callback(true);
            return;
        }
        if(--_rTime > 0){
            setTimeout(timer, 10);
        }else {
            log('Error: css("' + url + '" timeout!');
            core_hideDiv_removeChild(load_div);
            callback(false);
        }
    };
    setTimeout(timer, 50);
}