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
//import render/control/toTiggerChildren
//import render/control/checkResChanged

var render_control_main_types = ['css', 'tpl', 'data', 'logic'];
var render_control_main_realTypeMap = {
    tpl  : 'tplFn',
    data : 'real_data',
    logic: 'logicFn'
}

function render_control_main(boxId, controllerNs) {
    render_base_count++;
    //资源容器
    var resContainer = render_base_resContainer[boxId] =  render_base_resContainer[boxId] || {
        boxId: boxId,
        controllerNs: controllerNs,
        childrenid: {},
        s_childMap: {},
        needToTriggerChildren: false,
        toDestroyChildrenid: null,
        forceRender: false
    };
    var box = getElementById(boxId);
    var toDoSetsTimer = null;
    
    //状态类型 newset|loading|ready
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned
 
    var changeResList = {};
    var control = {
        id : boxId,
        setForceRender: function(_forceRender) {
            resContainer.forceRender = _forceRender;
        },
        get: function(url, type) {
            var result = '';
            /*if(type === 'tpl'){}*/
            return result;
        },
        set: function(type, value) {
            if (!boxId) {
                return;
            }
            if(core_object_typeof(type) === 'object') {
                for(var key in type) {
                    control.set(key, type[key]);
                }
                return;
            }

            if(changeResList[type] = render_control_checkResChanged(resContainer, type, value)){
                resContainer[type] = value;
                toDoSets();
                return;
            }
            resContainer[type] = value;
            
        },
        _refresh: function() {
            resContainer.needToTriggerChildren = true;
            changeResList['data'] = true;
            toDoSets();
        },
        _destroy: function() {
            boxId = control._controller = resContainer = box = toDoSetsTimer = undefined;
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
                    // if (render_control_main_realTypeMap[type] && render_control_main_realTypeMap[type] in resContainer) {
                    //     delete resContainer[render_control_main_realTypeMap[type]];
                    // }
                }
            } else if (resContainer.fromParent) {
                if (resContainer[type]) {
                    changeResList[type] = true;
                }
            }          
        }

        toDoSets();
    }

    function toDoSets() {
        clearTimeout(toDoSetsTimer);
        toDoSetsTimer = setTimeout(function() {
            resContainer.lastRes = null;

            var tplChanged = changeResList['tpl'];
            var dataChanged = changeResList['data'];
            var cssChanged = changeResList['css'];
            var logicChanged = changeResList['logic'];
            resContainer.childrenChanged = changeResList['children'];

            changeResList = {};

            if (tplChanged || dataChanged) {
                resContainer.rendered = false;
                resContainer.html = '';
                resContainer.toDestroyChildrenid = core_object_clone(resContainer.childrenid);
            } else {
                render_contorl_toTiggerChildren(resContainer);
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

            tplChanged && render_control_setTpl(resContainer);
            dataChanged && render_control_setData(resContainer);
            cssChanged && render_control_setCss(resContainer);
            logicChanged && render_control_setLogic(resContainer);
            resContainer.childrenChanged && render_control_setChildren(resContainer);
        });
    }
}