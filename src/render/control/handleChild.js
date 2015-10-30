/*
 * 处理子模块
*/
//import ../base
//import ../run

function render_control_handleChild(boxId, tplParseResult) {
    var resContainer = render_base_resContainer[boxId];
    var s_controller, s_child, s_id;
    var parseResultEle;
    var childResContainer = {};
    for (var i = 0, len = tplParseResult.length; i < len; i++) {
        parseResultEle = tplParseResult[i];
        s_id = parseResultEle['s-id'];
        childResContainer = render_base_resContainer[s_id] = render_base_resContainer[s_id] || {
            boxId: s_id,
            childrenid: {},
            s_childMap: {},
            needToTriggerChildren: false,
            toDestroyChildrenid: null,
            forceRender: false,
            lastRes:{},
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
                resContainer.s_childMap[s_child] = s_id;
            } else {
                s_controller = parseResultEle['s-controller']
            }
            childResContainer.controllerNs = s_controller;
            render_run(s_id, s_controller);//渲染提前
        }
    }
}