/**
 * 场景管理
 * 第一版本实现目标：
 */
//import ./base
//import core/dom/createElement
//import core/dom/setAttribute
//import ./control/destroy
//import core/dom/removeNode
//import core/dom/getComputedStyle
//import core/dom/querySelectorAll
//import core/event/addEventListener
//import core/event/removeEventListener
//import core/event/eventFix
//import core/math/distance
//import core/dom/className
//import router/history

var render_stage_data = {}; //stageBoxId -> {curr:index, last:index, subs:[]}
var render_stage_anidata = {};
var render_stage_style_mainId = 'steel-style-main';
var render_stage_style_rewriteId = 'steel-style-rewrite';
var render_stage_ani_transition_class = 'steel-stage-transform';
var render_stage_scroll_class = 'steel-render-stage-scroll';
var render_stage_fixed_class = 'steel-render-stage-fixed';
var render_stage_subNode_class = 'steel-stage-sub';
//状态变量区域
var render_stage_webkitTransitionDestroyFn;
var render_stage_ani_doing;
var render_stage_input_focused;
var render_stage_boxId;
var render_stage_touch_status_started;
var render_stage_touch_status_start_time;
var render_stage_touch_status_moved;
var render_stage_touch_status_move_time;
var render_stage_touch_status_ended;
var render_stage_touch_status_end_time;
////

var inputReg = /input|textarea/i;

/**
 * 获取当前渲染的stageBoxId
 */
function render_stage_getBox() {
    return getElementById(render_stage_boxId || mainBox && mainBox.id);
}

/**
 * 获取当前支持滚动的节点的id  这个方法只在启用了并支持场景切换功能时有效，
 */
function render_stage_getScrollBox() {
    var boxId = render_stage_boxId || mainBox && mainBox.id;
    var stageScrollId;
    if (render_base_stageChange_usable) {
        stageScrollId = render_base_resContainer[boxId] && render_base_resContainer[boxId].stageScrollId;
        if (stageScrollId) {
            return getElementById(stageScrollId);
        }
    }
}

function render_stage_init() {
    render_stage_style_init();
    render_stage_change_init();
}

//场景切换功能初始化
function render_stage_change_init() {
    if (!render_base_stageChange_usable) {
        return;
    }
    var touchDataStartX, touchDataStartY, touchDataLastX, touchDataLastY, touchDataX, touchDataY;
    // var touchDirection, touchMoved;
    // var touchStartTime;
    // var isPreventDefaulted;
    var isInputTouched;
    var lastTouchendTime;

    core_event_addEventListener(docElem, 'touchstart', function(e) {
        core_event_eventFix(e);
        checkStopEvent(e);
        render_stage_touch_status_started = true;
        render_stage_touch_status_moved = false;
        render_stage_touch_status_start_time = now();
        render_stage_touch_status_ended = undefined;
        render_stage_touch_status_end_time = undefined;
        if (render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        readTouchData(e);
        touchDataStartX = touchDataX;
        touchDataStartY = touchDataY;
        // touchStartTime = now();
        // 针对iphone下文本框输入时样式错乱问题的方法解决
        if (iphone) {
            isInputTouched = inputReg.test(e.target.tagName);
            if (!isInputTouched) {
                render_stage_input_focused = false;
                render_stage_style_rewrite();
            }
        }
        
    });

    // core_event_addEventListener(docElem, 'touchmove', function(e) {
    //     if (e._7) {
    //         return;
    //     }
    //     e._7 = true;
    //     var oldPreventDefault = e.preventDefault;
    //     isPreventDefaulted = false;
    //     e.preventDefault = function() {
    //         isPreventDefaulted = true;
    //         oldPreventDefault.call(e);
    //     };
    // }, true);
    var count = 0;
    core_event_addEventListener(docElem, 'touchmove', function(e) {
        readTouchData(e);
        render_stage_touch_status_moved = true;
        // if (core_math_distance([touchDataX, touchDataY], [touchDataLastX, touchDataLastY]) > 15) {
        //     render_stage_touch_status_moved = true;
        // }
        render_stage_touch_status_move_time = now();
        if (render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        // if (!touchDirection) {
        //     touchDirection = (Math.abs(touchDataY - touchDataLastY) > Math.abs(touchDataX - touchDataLastX)) ? 'Y' : 'X';
        // }
        // touchMoved = true;
        // if (isPreventDefaulted) {
        //     return;
        // }

        // if (touchDirection === 'X') {
        //     // e.preventDefault();
        // } else {
            
        // }
    });

    core_event_addEventListener(docElem, 'touchend', function(e) {
        core_event_eventFix(e);
        checkStopEvent(e);
        //阻止dblclick的默认行为
        if (lastTouchendTime && now() - lastTouchendTime < 300 || render_stage_webkitTransitionDestroyFn) {
            e.preventDefault();
        }
        render_stage_touch_status_ended = true;
        render_stage_touch_status_end_time = lastTouchendTime = now();
        // readTouchData(e);
        // touchDirection = touchMoved = undefined;
        // 针对iphone下文本框输入时样式错乱问题的方法解决
        if (iphone) {
            if (isInputTouched && inputReg.test(e.target.tagName)) {
                render_stage_input_focused = true;
                render_stage_style_rewrite();
            }
        }
    });

    //动画期间阻止一切事件的触发
    core_event_addEventListener(docElem, 'click', checkStopEvent);

    function readTouchData(e) {
        var touch = e.changedTouches[0];
        touchDataLastX = touchDataX;
        touchDataLastY = touchDataY;
        touchDataX = touch.clientX;
        touchDataY = touch.clientY;
    }
    //动画期间阻止一切事件的触发
    function checkStopEvent(e) {
        if (render_stage_ani_doing) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}

function render_stage_change_check_host_behaviour_onStageChangeBack() {
    if (iphone && render_stage_touch_status_started && render_stage_touch_status_moved) {
        if (!render_stage_touch_status_ended) {
            return true;
        } else if (now() - render_stage_touch_status_end_time < 377) {
            return true;
        }
    }
}

/**
 * 根据路由类型在维护当前场景并返回当前路由与该场景对应的渲染节点
 * @param  {string} stageBoxId  场景主节点
 * @param  {string} routerType init/new/forward/bak/refresh/replace
 */
function render_stage(stageBoxId, routerType) {

    var stateIndex = router_history_getStateIndex();
    var data = render_stage_data_get(stageBoxId, stateIndex);
    var node = getElementById(stageBoxId);
    core_dom_setAttribute(node, 's-stage-sup', 'true');
    if (!data.subs[stateIndex]) {
        render_stage_data_newsub(node, data, stateIndex);
    }
    var subData = data.subs[stateIndex];
    data.last = data.curr;
    data.curr = stateIndex;
    return (render_stage_boxId = subData.id);
}

function render_stage_ani(stageBoxId, aniType, aniEnd) {
    render_stage_ani_doing = true;
    var node = getElementById(stageBoxId);
    var data = render_stage_data_get(stageBoxId);
    var subs = data.subs;
    var last = data.last;
    var curr = data.curr;
    var lastSub = subs[last];
    var currSub = subs[curr];
    var goForward = curr > last;
    var renderFromStage = false;
    var lastNode = getElementById(lastSub.id);
    var currNode = getElementById(currSub.id);

    if (lastSub !== currSub) {

        renderFromStage = currSub.inStage && render_base_stageCache_usable;
        
        //在iphone下判断web宿主容器的行为，如果发现是宿主切换的页面就不做动画，原因是宿主的行为不能被阻止，
        var is_host_behaviour = curr < last && render_stage_change_check_host_behaviour_onStageChangeBack();
        // window._setTitle && _setTitle(is_host_behaviour ? '1111' : '000000');
        if (render_base_stageChange_usable && !is_host_behaviour) {
            var winWidth = docElem.clientWidth;
            var winHeight = docElem.clientHeight;
            var bodyBackgroundColor = core_dom_getComputedStyle(document.body, 'backgroundColor');
            render_stage_webkitTransitionDestroyFn && render_stage_webkitTransitionDestroyFn();
            var currLeft = (goForward ? winWidth : -winWidth/3);
            currNode.style.top = 0;
            currNode.style.left = currLeft + 'px';

            if (goForward) {
                lastNode.style.zIndex = 99;
                currNode.style.zIndex = 100;
                currNode.style.boxShadow = '0 0 20px 0 rgba(0,0,0,0.40)';
                currNode.style.backgroundColor = bodyBackgroundColor;
            } else {
                currNode.style.zIndex = 99;
                lastNode.style.zIndex = 100;
                lastNode.style.boxShadow = '0 0 20px 0 rgba(0,0,0,0.40)';
                lastNode.style.backgroundColor = bodyBackgroundColor;
            }
            currNode.style.display = '';
            render_stage_input_focused = false;
            render_stage_webkitTransitionDestroyFn = node_webkitTransitionDestroy;
            render_stage_style_rewrite();

            setTimeout(function() {
                currNode.style.WebkitTransform = 'translate3d(' + (-currLeft) + 'px, 0, 0)';
                lastNode.style.WebkitTransform = 'translate3d(' + (goForward ? -winWidth/3 : winWidth) + 'px, 0, 0)';
                core_dom_className(currNode, render_stage_ani_transition_class);
                core_dom_className(lastNode, render_stage_ani_transition_class);
                core_event_addEventListener(node, 'webkitTransitionEnd', node_webkitTransitionEnd);
            }, 199);

            function node_webkitTransitionEnd(e) {
                var target = (e.target || e.srcElement);
                if (target !== currNode && target !== lastNode) {
                    return;
                }
                node_webkitTransitionDestroy();
            }

            function node_webkitTransitionDestroy() {
                if (!render_stage_webkitTransitionDestroyFn) {
                    return;
                }
                render_stage_webkitTransitionDestroyFn = false;
                core_event_removeEventListener(node, 'webkitTransitionEnd', node_webkitTransitionEnd);
                core_dom_className(currNode, undefined, render_stage_ani_transition_class);
                core_dom_className(lastNode, undefined, render_stage_ani_transition_class);
                currNode.style.cssText = '';
                lastNode.style.cssText = 'display:none';
                render_stage_style_rewrite();
                doDestroy();
                callAniEnd();
            }
        } else {
            if (render_base_stageChange_usable && is_host_behaviour) {
                lastNode.style.display = 'none';
                currNode.style.display = '';
                doDestroy();
                callAniEnd();
            } else {//当不是系统切换页面行为时使用等待的方式解决透传问题
                setTimeout(function() {
                    lastNode.style.display = 'none';
                    currNode.style.display = '';
                    doDestroy();
                    callAniEnd();
                }, 366);
            }
        }
    } else {
        currNode.style.display = '';
        callAniEnd();
    }
    if (currSub) {
        currSub.inStage = true;
    }
    return renderFromStage;

    function doDestroy() {
        var index = router_history_getStateIndex();
        render_stage_destroy(data, index + 1);
        if (!render_base_stageCache_usable) {
            render_stage_destroy(data, 0, index - 1);
        }
    }

    function callAniEnd() {
        if (aniEnd) {
            aniEnd(currSub.id, lastSub.id, renderFromStage);
        }
        render_stage_touch_status_started = false;
        setTimeout(function() {
            render_stage_ani_doing = false;
        }, 377);
    }

}

/**
 * 销毁场景下无用的子
 */
function render_stage_destroy(data, fromIndex, toIndex) {
    var subs = data.subs;
    var destroySubs = [];
    toIndex = toIndex === undefined ? (subs.length - 1) : toIndex;

    for (var i = fromIndex; i <= toIndex; ++i) {
        destroySubs.push(subs[i]);
        subs[i] = undefined;
    }

    setTimeout(function() {
        for (var i = 0, l = destroySubs.length; i < l; ++i) {
            if (destroySubs[i]) {
                var subId = destroySubs[i].id;
                !function(subId) {
                    setTimeout(function() {
                        try{
                            render_control_destroy(subId);
                        } catch(e) {
                            log('Error: destroy subId(' + subId + ') error in stage!');
                        } finally {
                            core_dom_removeNode(getElementById(subId));
                        }
                    });
                }(subId);
            }
        }
    }, 377);
}

/**
 * 新建子数据和节点 step 步数
 */
function render_stage_data_newsub(node, data, stateIndex) {
    var subId = render_base_idMaker();
    var subNode = core_dom_createElement('div');
    subNode.id = subId;
    core_dom_className(subNode, render_stage_subNode_class);
    core_dom_setAttribute(subNode, 's-stage-sub', 'true');
    subNode.innHTML = render_base_stageDefaultHTML;
    subNode.style.display = 'none';
    node.appendChild(subNode);
    var subs = data.subs;
    subs[stateIndex] = {
        id: subId
    };
    if (stateIndex >= render_base_stage_maxLength) {
        render_stage_destroy(data, 0, stateIndex - render_base_stage_maxLength + 1);
        return true;
    }
}

/**
 * 产生并获取数据结构
 */
function render_stage_data_get(stageBoxId, stateIndex) {
    if (!render_stage_data[stageBoxId]) {
        render_stage_data[stageBoxId] = {
            last: stateIndex,
            curr: stateIndex,
            subs: []
        };
    }
    return render_stage_data[stageBoxId];
}
//fixed元素处理 解决动画时和动画后fixed节点抖动的问题
function render_stage_style_init() {
    if (!render_base_stage_usable) {
        return;
    }
    var styleTextArray = [];
    if (render_base_stageChange_usable) {
        styleTextArray.push('body{overflow:hidden;-webkit-overflow-scrolling : touch;}');//
        styleTextArray.push('.' + render_stage_ani_transition_class + '{-webkit-transition: -webkit-transform 0.4s ease-out;transition: transform 0.4s ease-out;}');
        styleTextArray.push('.' + render_stage_subNode_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;}');
        styleTextArray.push('.' + render_stage_scroll_class + '{position:absolute;top:0;left:0;width:100%;height:100%;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;-webkit-box-sizing : border-box;}');
    }
    styleTextArray.push('.' + render_stage_fixed_class + '{position:fixed!important;}');
    var styleEl = core_dom_createElement('style');
    core_dom_setAttribute(styleEl, 'type', 'text/css');
    styleEl.id = render_stage_style_mainId;
    styleEl.innerHTML = styleTextArray.join('');
    head.appendChild(styleEl);
}

/**
 * Steel自带样式重写方法，当处于动画中时fixed节点使用abosolute，当input得到焦点时scroll节点删除overflow-y：auto，解决input聚焦时业务样式丢失的问题
 */
function render_stage_style_rewrite() {
    var styleTextArray = [];
    if (render_stage_webkitTransitionDestroyFn) {
        styleTextArray.push('.' + render_stage_fixed_class + '{position:absolute!important;}');
    }
    if (render_stage_input_focused) {
        styleTextArray.push('.' + render_stage_scroll_class + '{overflow-y: visible!important;}');
    }

    var styleEl = getElementById(render_stage_style_rewriteId);
    if (!styleEl) {
        styleEl = core_dom_createElement('style');
        core_dom_setAttribute(styleEl, 'type', 'text/css');
        styleEl.id = render_stage_style_rewriteId;
        styleEl.innerHTML = styleTextArray.join('');
        head.appendChild(styleEl);
    } else {
        styleEl.innerHTML = styleTextArray.join('');
    }
}