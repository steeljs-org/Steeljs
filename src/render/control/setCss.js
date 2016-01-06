//import ../base
//import core/object/isEmpty
//import core/dom/removeNode
//import resource/res
//import ../error
//import ./render
//import core/notice
//import core/nameSpaceFix

var render_control_setCss_cssCache = {};//css容器

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
    var controllerNs = render_base_controllerNs[boxId];
    var css = core_nameSpaceFix(resContainer.css, controllerNs);

    if (render_control_setCss_cssCache[css]) {
        render_control_setCss_cssCache[css][boxId] = true;
        cssReady();
        return;
    }

    render_control_setCss_cssCache[css] = {};
    render_control_setCss_cssCache[css][boxId] = true;

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
    css && resource_res.css(css, cb, function() {
        log('Error: css("' + css + '" load error!');
        cssReady();
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