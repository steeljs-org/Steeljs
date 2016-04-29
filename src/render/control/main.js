/*
 * control核心逻辑
 */
//import ../base
//import resource/res
//import core/object/typeof
//import core/dom/getAttribute
//import core/object/clone
//import core/dom/removeNode
//import render/control/setChildren
//import render/control/setCss
//import render/control/setLogic
//import render/control/setChildren
//import render/control/setTpl
//import render/control/setData
//import render/control/setComponent
//import render/control/toTiggerChildren
//import render/control/checkResChanged

var render_control_main_types = ['css', 'tpl', 'data', 'logic', 'component'];
var render_control_main_realTypeMap = {
    tpl: 'tplFn',
    data: 'real_data',
    logic: 'logicFn',
    component: 'compositeFn'
};

var render_control_main_eventList = [
  'init',//模块初始化
  'enter',//模块从其他模块切换进入（不一定只发生在初始化时）
  'leave',//模块离开（不一定销毁）
  'error',//模块运行时错误，类型资源错误（data,tpl,css,logic）、渲染错误(render)、逻辑运行错误(run,runLogic)
  'destroy'//模块销毁事件
  ];

function render_control_main(boxId) {

    //资源容器
    var resContainer = render_base_resContainer[boxId] = render_base_resContainer[boxId] || {
        boxId: boxId,
        childrenid: {},
        s_childMap: {},
        needToTriggerChildren: false,
        toDestroyChildrenid: null,
        forceRender: false
    };
    var box = getElementById(boxId);
    var dealCalledByUser;

    //状态类型 newset|loading|ready
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned

    var changeResList = {};
    var control = {
        id: boxId,

        setForceRender: function(_forceRender) {
            resContainer.forceRender = _forceRender;
        },
        get: function(type) {
            return resContainer && resContainer[type];
        },
        set: function(type, value, toDeal) {
            if (!boxId) {
                return;
            }
            if (core_object_typeof(type) === 'object') {
                toDeal = value;
                for (var key in type) {
                    control.set(key, type[key]);
                }
                if (toDeal) {
                    deal();
                }
                return;
            }
            changeResList[type] = render_control_checkResChanged(resContainer, type, value);
            resContainer[type] = value;
            if (changeResList[type] && toDeal) {
                deal();
            }
        },
        /**
         * 控制器事件
         */
        on: function(type, fn) {
            if (render_control_main_eventList.indexOf(type) > -1) {
                core_notice_on(boxId + type, fn);
            }
        },
        off: function(type, fn) {
            if (render_control_main_eventList.indexOf(type) > -1 && fn) {
                core_notice_off(boxId + type, fn);
            }
        },
        refresh: function(forceRender) {
            resContainer.needToTriggerChildren = true;
            if (forceRender) {
                resContainer.real_data = undefined;
            }
            changeResList['data'] = true;
            deal();
        },
        /**
         * 资源处理接口,用户可以使用这个接口主动让框架去分析资源进行处理
         * @type {undefined}
         */
        deal: deal,
        _destroy: function() {
            for (var i = render_control_main_eventList.length - 1; i >= 0; i--) {
                core_notice_off(boxId + render_control_main_eventList[i]);
            }
            boxId = control._controller = resContainer = box = undefined;

        }
    };

    init();

    return control;

    function init() {
        resContainer.needToTriggerChildren = true;
        //状态
        resContainer.cssReady = true;
        resContainer.dataReady = true;
        resContainer.tplReady = true;
        resContainer.logicReady = true;
        resContainer.rendered = true;
        resContainer.logicRunned = false;
        //react 组件加载状态
        resContainer.componentReady = true;

        //第一层不能使用s-child与s-controller，只能通过render_run执行controller
        var type, attrValue;
        resContainer.lastRes = {};
        changeResList = {};

        for (var i = 0, l = render_control_main_types.length; i < l; ++i) {
            type = render_control_main_types[i];
            type !== 'data' && (resContainer.lastRes[type] = resContainer[type]);
            
            if (box) {
                attrValue = core_dom_getAttribute(box, 's-' + type);
                if (attrValue) {
                    if (render_control_checkResChanged(resContainer, type, attrValue)) {
                        changeResList[type] = true;
                        resContainer[type] = attrValue;
                    }
                } else {
                    if (type in resContainer) {
                        delete resContainer[type];
                    }
                }
            }
            if (resContainer.fromParent) {
                if (resContainer[type]) {
                    changeResList[type] = true;
                }
            }
        }
        resContainer.fromParent = false;
    }

    function deal(isSelfCall) {
        if (isSelfCall) {
            if (dealCalledByUser) {
                return;
            }
        } else {
            dealCalledByUser = true;
        }
        
        resContainer.lastRes = null;
        var tplChanged = changeResList['tpl'];
        var dataChanged = changeResList['data'];
        var cssChanged = changeResList['css'];
        var logicChanged = changeResList['logic'];
        var componentChanged = changeResList['component'];

        resContainer.childrenChanged = changeResList['children'];

        changeResList = {};

        if(componentChanged){
            resContainer.rendered = false;
            resContainer.virtualDom = '';
        }
        else if (tplChanged || dataChanged) {
            resContainer.rendered = false;
            resContainer.html = '';
            resContainer.toDestroyChildrenid = core_object_clone(resContainer.childrenid);
        } else {
            render_contorl_toTiggerChildren(resContainer);
        }

        if (componentChanged) {
            resContainer.componentReady = false;
        }
        if (tplChanged) {
            resContainer.tplReady = false;
        }
        if (dataChanged) {
            resContainer.dataReady = false;
        }
        if (cssChanged) {
            resContainer.cssReady = false;
        }
        if (logicChanged) {
            resContainer.logicReady = false;
        }
        !resContainer.tpl && delete resContainer.tplFn;
        !resContainer.logic && delete resContainer.logicFn;

        componentChanged && render_control_setComponent(resContainer);
        tplChanged && render_control_setTpl(resContainer);
        dataChanged && render_control_setData(resContainer, tplChanged);
        cssChanged && render_control_setCss(resContainer);
        logicChanged && render_control_setLogic(resContainer);
        resContainer.childrenChanged && render_control_setChildren(resContainer);
    }
}
