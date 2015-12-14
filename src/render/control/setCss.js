//import ../base
//import core/object/isEmpty
//import core/dom/removeNode
//import resource/res
//import ../error
//import ./render
//import core/notice
//import core/nameSpaceFix

var render_control_setCss_cssPrefix = 'S_CSS_';
var render_control_setCss_cssCache = {};//css容器

function render_control_setCss(resContainer) {
    var cssCallbackFn;
    var startTime = null;
    var endTime = null;
    var css = resContainer.css;

    if (!css) {
        render_control_destroyCss(resContainer);
    }
    var boxId = resContainer.boxId;
    var controllerNs = render_base_controllerNs[boxId];
    var css = core_nameSpaceFix(resContainer.css, controllerNs);
    var cssId = render_control_getCssId(css);
    var linkId = 'link_' + cssId;

    if (render_control_setCss_cssCache[linkId]) {
        cssReady();
        return;
    }

    render_control_setCss_cssCache[linkId] = {};
    render_control_setCss_cssCache[linkId][boxId] = true;

    var cb = cssCallbackFn = function(){
        if(cb === cssCallbackFn) {
            endTime = now();
            core_notice_trigger('cssTime', {
                startTime: startTime,
                cssTime: (endTime - startTime) || 0,
                ctrlNS: controllerNs
            });
            cssReady();
            //抛出css加载完成事件
        }
    };
    startTime = now();
    css && resource_res.css(css, cb, function(){
        resContainer.cssReady = true;
        render_control_destroyCss(boxId);
        render_control_render(resContainer);
    }, cssId);
    function cssReady() {
        render_control_destroyCss(resContainer, linkId);
        resContainer.cssReady = true;
        render_control_render(resContainer);
    }
}

function render_control_destroyCss(resContainer, linkId) {
    var boxId = resContainer.boxId;
    for(var _linkId in render_control_setCss_cssCache) {
        if (linkId === _linkId) {
            continue;
        }
        var linkCache = render_control_setCss_cssCache[_linkId];
        if (linkCache[boxId]) {
            delete linkCache[boxId];
            !function() {
                for (var _boxId in linkCache) {
                    return;
                }
                var linkDom = getElementById(_linkId);
                if (linkDom) {
                    core_dom_removeNode(linkDom);
                }
                delete render_control_setCss_cssCache[_linkId];
            }();
        }
    }
}

function render_control_getCssId(path) {
    return path && render_control_setCss_cssPrefix + path.replace(/(\.css)$/i, '').replace(/\//g, '_');
}