//import ../base
//import core/object/isEmpty
//import core/dom/removeNode
//import resource/res
//import ../error
//import ./render
//import core/notice

var render_control_setCss_cssPrefix = 'S_CSS_';
var render_control_setCss_cssCache = {};//css容器


function render_control_setCss(resContainer) {
    var cssCallbackFn;
    var startTime = null;
    var endTime = null;
    var controllerNs = resContainer.controllerNs;
    var css = resContainer.css;
    var boxId = resContainer.boxId;
    var linkId = render_control_getLinkId(css);//render_control_setCss_cssPrefix + resContainer.css.replace(/\//g, '_');
    var cssCache = render_control_setCss_cssCache[boxId] = render_control_setCss_cssCache[boxId] || {
        last: null,
        cur: null
    };
    var cb = cssCallbackFn = function(){
        cssCache.cur = linkId;
        if(cb === cssCallbackFn) {
            endTime = new Date;
            core_notice_fire('cssTime', {
                startTime: startTime,
                cssTime: (endTime - startTime) || 0,
                ctrlNS: controllerNs
            });
            resContainer.cssReady = true;
            render_control_render(resContainer);
            //抛出css加载完成事件
        }
    }
    startTime = new Date;
    css && resource_res.css(css, cb, function(){
        resContainer.cssReady = true;
        render_control_destroyCss(boxId);
        render_control_render(resContainer);
    }, linkId);
}

function render_control_destroyCss(resContainer) {
    var boxId = resContainer.boxId;
    var cssCache = render_control_setCss_cssCache[boxId];
    var css = resContainer.css;
    var linkId = render_control_getLinkId(css);
    if (!cssCache) {
        return;
    }
    
    if (linkId && linkId == cssCache.last) {
        return;
    }
    
    if (cssCache.last) {
        var cssDom = getElementById(cssCache.last);
        cssDom && core_dom_removeNode(cssDom);
    }
    cssCache.last = cssCache.cur;
    cssCache.cur = null;
}

function render_control_getLinkId(path) {
    return path && render_control_setCss_cssPrefix + path.replace(/(\.css)$/i, '').replace(/\//g, '_');
}