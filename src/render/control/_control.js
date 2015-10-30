/**
 * 控制逻辑
 */

//import ./base
//import ./error
//import ./parse
//import ./run
//import ./addHTML
//import core/uniqueKey
//import resource/res
//import require/global
//import core/object/typeof
//import core/array/delete
//import core/object/equals
//import core/dom/getAttribute
//import core/object/clone

//control生成器
function render_control(boxId) {
    
    var tplParseResult = [];
    var childWaitingCache = render_childWaitingCache[boxId] = [];
    //资源容器
    var resContainer = render_resContainer[boxId];
    if (resContainer) {
        resContainer.useTime++;
    } else {
        resContainer = render_resContainer[boxId] = {
            childrenid: {},
            useTime: 1
        };
    }

    var useTime = resContainer.useTime;
    var parentId = resContainer.parentId;
    var box = getElementById(boxId);
    var toDoSetsTimer = null;


    //回调方法变量
    var tplCallbackFn;
    var dataCallbackFn;
    var logicCallbackFn;
    var cssCallbackFn;

    //状态类型 newset|loading|ready
    //
    //tpl,css,data,logic,children,render,
    //tplReady,cssReady,dataReady,logicReady,rendered,logicRunned
 
    var children_noController = {};
    // resContainer.changeResList = {};
    var changeResList = {};
    var toDestroyChildrenid;
    var needToTriggerChildren;

    var forceRender;

    var control = {
        id : boxId,
        setForceRender: function(_forceRender) {
            forceRender = _forceRender;
        },
        get: function(url, type) {
            var result = '';
            /*if(type === 'tpl'){

            }*/
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

            if(!checkResChanged(type, value)){
                return;
            }
            resContainer[type] = value;
            changeResList[type] = true;
 
            toDoSets();
        },
        _refresh: function() {
            needToTriggerChildren = true;
            changeResList['data'] = true;
            toDoSets();
        },
        _destroy: function() {
            boxId = control._controller = tplParseResult = childWaitingCache = resContainer = parentId = box = toDoSetsTimer = tplCallbackFn = dataCallbackFn = logicCallbackFn = cssCallbackFn = undefined;
        }
    };

    init();

    return control;

    function init() {
        needToTriggerChildren = true;
        //状态
        resContainer.cssReady = true;
        resContainer.dataReady = true;
        resContainer.tplReady = true;
        resContainer.logicReady = true;
        resContainer.rendered = true;
        resContainer.logicRunned = false;
        
        
        //第一层不能使用s-child与s-controller，只能通过render_run执行controller
        //暂且这么解析吧
        var type, attrValue;
        var types = ['css', 'tpl', 'data', 'logic'];
        for (var i = 0, l = types.length; i < l; ++i) {
            type = types[i];
            if (box) {
                attrValue = core_dom_getAttribute(box, 's-' + type);
                if (attrValue && checkResChanged(type, attrValue)) {
                    changeResList[type] = true;
                    resContainer[type] = attrValue;
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
            
            var tplChanged = changeResList['tpl'];
            var dataChanged = changeResList['data'];
            var cssChanged = changeResList['css'];
            var logicChanged = changeResList['logic'];
            var childrenChanged = changeResList['children'];
            changeResList = {};

            if (tplChanged || dataChanged) {
                resContainer.rendered = false;
                resContainer.html = '';
                toDestroyChildrenid = core_object_clone(resContainer.childrenid);
            } else {
                toTiggerChildren();
            }

            tplChanged && setTpl();
            dataChanged && setData();
            cssChanged && setCss();
            logicChanged && setLogic();
            childrenChanged && setChildren();
        });

    }

     //检查资源是否改变
    function checkResChanged(type, value) {

        var valueType = core_object_typeof(value);

        if (type === 'data') {
            return true;
        }

        if (valueType === 'function') {
            return !resContainer[type + 'Fn'] || resContainer[type + 'Fn'].toString() !== value.toString();
        }

        if (type === 'tpl' || type === 'logic') {
            return !(resContainer[type + 'Fn'] && resContainer[type + 'Fn'] === require_runner(value)[0]);
        }

        if (type === 'children') {
            return !core_object_equals(resContainer[type], value);
        }

        return resContainer[type] !== value;

    }

    function setData() {
        resContainer.dataReady = false;
        dataCallbackFn = undefined;
        // var last_real_data = resContainer.real_data;
        // resContainer.real_data = undefined;
        var data = resContainer.data;
        if (data === null || data === 'null') {
            toRender({});
            return;
        }
        if (!data) {
            return;
        }
        var dataType = core_object_typeof(data);
        
        if (dataType === 'object') {
            toRender(data);
        } else if (dataType === 'string') {
            var cb = dataCallbackFn = function(ret) {
                if (cb === dataCallbackFn) {
                    toRender(ret.data);//||
                }
            };
            resource_res.get(data, cb, render_error);
        }
        function toRender(data) {
            resContainer.dataReady = true;
            if (forceRender || !core_object_equals(data, resContainer.real_data)) {
                resContainer.real_data = data;
                render();
            } else {
                toTiggerChildren();
            }
        }
    }
    function setCss() {
        resContainer.cssReady = false; 
        var cssCallbackFn = undefined;
        var cb = cssCallbackFn = function(){
            if(cb === cssCallbackFn) {
                resContainer.cssReady = true;
                render();
                //抛出css加载完成事件
            }
        }
        resContainer.css && resource_res.css(resContainer.css, cb, render_error);
    }
    function setTpl() {
        resContainer.tplReady = false;
        tplCallbackFn = undefined;
        resContainer.tplFn = null;
        var tpl = resContainer.tpl;
        if(tpl){
            if(core_object_typeof(tpl) === 'function'){
                resContainer.tplFn = tpl;
                toRender();
                return;
            }
            var cb = tplCallbackFn = function(jadefn){
                if(cb === tplCallbackFn){
                    resContainer.tplFn = jadefn;
                    toRender();
                }
            }
            require_global(tpl, cb, render_error);
        }

        function toRender() {
            resContainer.tplReady = true;
            render();
        }
    }

    function setLogic() {
        resContainer.logicReady = false;
        var logicCallbackFn = undefined;
        resContainer.logicFn = null;
        var logic = resContainer.logic;
        resContainer.logicRunned = false;
        if(logic){
            if(core_object_typeof(logic) === 'function'){
                resContainer.logicFn = logic;
                toStartLogic();
            } else {
                var cb = logicCallbackFn = function(fn) {
                    if(cb === logicCallbackFn){
                        fn && (resContainer.logicFn = fn);
                        toStartLogic();
                    }
                    //抛出js加载完成事件
                }
                require_global(logic, cb, render_error);
            }
        }
        function toStartLogic() {
            resContainer.logicReady = true;
            startLogic();
        }
    }

    function setChildren() {
        var children = resContainer.children || {};
        for (var key in children) {
            //如果存在，相应的key则运行
            if (children_noController[key]) {
                render_run(children_noController[key], children[key]);
            }
        }
    }

    function startLogic() {
        if(!resContainer.logicRunned && resContainer.logicFn && resContainer.logicReady && resContainer.rendered) {
            resContainer.logicResult = resContainer.logicFn(box) || {};
            resContainer.logicRunned = true;
        }
    }

    function destroyLogic() {
        resContainer.logicRunned = false;
        if (resContainer.logicResult) {
          resContainer.logicResult.destroy && resContainer.logicResult.destroy();
          delete resContainer.logicResult;
        }
    }

    function handleChild() {
        var s_controller, s_child, s_id;
        var parseResultEle;

        var childResContainer;

        for (var i = 0, len = tplParseResult.length; i < len; i++) {
            parseResultEle = tplParseResult[i];
            s_id = parseResultEle['s-id'];
            childResContainer = render_resContainer[s_id] = render_resContainer[s_id] || {
                childrenid: {},
                fromParent: true
            };
            resContainer.childrenid[s_id] = true;
            childResContainer.parentId = boxId;

            childResContainer.tpl = parseResultEle['s-tpl'];
            childResContainer.css = parseResultEle['s-css'];
            childResContainer.data = parseResultEle['s-data'];
            childResContainer.logic = parseResultEle['s-logic'];

            if(s_child = parseResultEle['s-child']) {
                s_child = (s_child === 's-child' ? '' : s_child);
                if(s_child) {
                    s_controller = resContainer.children && resContainer.children[s_child];
                    if (!s_controller) {
                        children_noController[s_child] = s_id;
                    }
                } else {
                    s_controller = parseResultEle['s-controller']
                }
                render_run(s_id, s_controller);//渲染提前
            }
        }
    }

    function render() {
        if(!resContainer.cssReady || !resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
            return;
        }
        var tplFn = resContainer.tplFn;
        var real_data = resContainer.real_data;
        if (!tplFn || !real_data) {
            return;
        }

        var html = resContainer.html;
        if (!html) {
            html = resContainer.html = tplFn(real_data);
            resContainer.childrenid = {};
            //子模块分析
            tplParseResult = render_parse(html);
            handleChild();
        }
        var parseResultEle = null;
        //1. box存在，addHTML，运行logic，运行子队列（子模块addHTML）
        //2. box不存在，则进入队列，待渲染
        box = box || getElementById(boxId);
        if (box) {
            //去掉节点上的资源信息
            for(var i = 0, len = tplParseResult.length; i < len; i++){
                parseResultEle = tplParseResult[i];
                html = html.replace(parseResultEle['s-all'], ' ' + render_base_moduleAttrName + '=' + render_base_moduleAttrValue + ' ' + parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
            }
            
            destroyLogic();
            // render_run_destroy(boxId);
            destroyChildren();
            box.innerHTML = html;
            //销毁css
            resContainer.rendered = true;
            startLogic();
            for(var i = 0, l = childWaitingCache.length; i < l; ++i) {
                childWaitingCache[i]();
            }
            childWaitingCache = render_childWaitingCache[boxId] = [];
        } else {
            if (parentId && render_childWaitingCache[parentId]) {
                render_childWaitingCache[parentId].push(render);
            }
        }
    }

    function toTiggerChildren() {
        if (needToTriggerChildren) {
            for (var id in resContainer.childrenid) {
                var childControl = render_controlCache[id];
                if (childControl) {
                    render_run(id, childControl._controller);
                }
            }
        }
        needToTriggerChildren = false;
    }

    function destroyChildren() {
        for (var id in toDestroyChildrenid) {
            var childResContainer = render_resContainer[id];
            var childControl = render_controlCache[id];
            if (childControl) {
                childControl._destroy();
                delete render_controlCache[id];
            }
            if (childResContainer) {
                if (childResContainer.logicResult) {
                  childResContainer.logicResult.destroy && childResContainer.logicResult.destroy();
                  delete childResContainer.logicResult;
                }
                delete render_resContainer[id];
            }
        }
        
    }
}