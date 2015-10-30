//import ../base
//import ../parse
//import ./handleChild
//import ./setLogic
//import ./setChildren
//import ./setCss
//import ./setExtTplData

var render_control_render_moduleAttrName = 's-module';
var render_control_render_moduleAttrValue = 'ismodule';
var render_control_render_childWaitingCache = {};//渲染列表

function render_control_render(resContainer) {
    var boxId = resContainer.boxId;
    var childWaitingCache = render_control_render_childWaitingCache[boxId] = [];
    if(!resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
        return;
    }
    var tplFn = resContainer.tplFn;
    var real_data = resContainer.real_data;
    if (!tplFn || !real_data) {
        return;
    }

    var html = resContainer.html;
    if (!html) {
        var parseResultEle = null;
        var extTplData = new render_control_setExtTplData_F();
        var retData = extTplData;
        for (var key in real_data) {
            retData[key] = real_data[key];
        }
        try{
            html = tplFn(retData);
        }catch(e) {
            render_error(e);
            return;
        }
        resContainer.childrenid = {};
        //子模块分析
        var tplParseResult = render_parse(html);
        //去掉节点上的资源信息
        for(var i = 0, len = tplParseResult.length; i < len; i++){
            parseResultEle = tplParseResult[i];
            html = html.replace(parseResultEle['s-all'], ' ' + render_control_render_moduleAttrName + '=' + render_control_render_moduleAttrValue + ' ' + parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        }
        render_control_handleChild(boxId, tplParseResult);
        resContainer.html = html;
    }
    if (!resContainer.cssReady) {
        return;
    }
    //1. box存在，addHTML，运行logic，运行子队列（子模块addHTML）
    //2. box不存在，则进入队列，待渲染
    var box = getElementById(boxId);
    
    if (box) {
        render_control_destroyLogic(resContainer);
        render_control_destroyChildren(resContainer.toDestroyChildrenid);
        box.innerHTML = html;
        render_base_count--;
        render_control_destroyCss(resContainer);
        resContainer.rendered = true;
        render_control_startLogic(resContainer);
        for(var i = 0, l = childWaitingCache.length; i < l; ++i) {
            childWaitingCache[i]();
        }
        childWaitingCache = render_control_render_childWaitingCache[boxId] = [];
        if (render_base_count <= 0) {
            core_notice_fire('allDomReady');
        }
    } else {
        var parentId = resContainer.parentId;
        if (parentId && render_control_render_childWaitingCache[parentId]) {
            render_control_render_childWaitingCache[parentId].push(render_control_render);
        }
    }
}