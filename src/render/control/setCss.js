//import ../base
//import core/object/isEmpty
//import core/dom/removeNode
//import resource/res
//import ../error
//import ./render
//import core/notice
//import core/nameSpaceFix
//import core/dom/className
//import ./triggerError

var render_control_setCss_cssCache = {};//css容器
var render_control_setCss_cssCallbackFn;

function render_control_setCss(resContainer) {
    var cssCallbackFn;
    var startTime = null;
    var endTime = null;
    var css = resContainer.css;

    if (!css) {
        cssReady();
        return;
    }
    var boxId = resContainer.boxId;
    var box;
    var cssId;
    var controllerNs = render_base_controllerNs[boxId];
    var css = core_nameSpaceFix(resContainer.css, controllerNs);
    //给模块添加css前缀
    if (render_base_useCssPrefix_usable && (box = getElementById(boxId)) && (cssId = resource_res_getCssId(css))) {
        core_dom_className(box, cssId);
    }
    if (render_control_setCss_cssCache[css]) {
        render_control_setCss_cssCache[css][boxId] = true;
        cssReady();
        return;
    }

    render_control_setCss_cssCache[css] = {};
    render_control_setCss_cssCache[css][boxId] = true;

    var cb = render_control_setCss_cssCallbackFn = function(){
        if(cb === render_control_setCss_cssCallbackFn) {
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
    resource_res.css(css, cb, function() {
        cssReady();
        render_control_triggerError(resContainer, 'css', css);
    });
    function cssReady() {
        resContainer.cssReady = true;
        render_control_render(resContainer);
    }
}

function render_control_setCss_destroyCss(resContainer, excludeSelf) {
    var boxId = resContainer.boxId;
    var controllerNs = render_base_controllerNs[boxId];
    var excludeCss = excludeSelf && core_nameSpaceFix(resContainer.css, controllerNs);
    for(var css in render_control_setCss_cssCache) {
        if (excludeCss === css) {
            continue;
        }
        var cssCache = render_control_setCss_cssCache[css];
        if (cssCache[boxId]) {
            delete cssCache[boxId];
            !function() {
                for (var _boxId in cssCache) {
                    return;
                }
                resource_res.removeCss(css);
                delete render_control_setCss_cssCache[css];
            }();
        }
    }
}