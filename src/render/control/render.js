//import ../base
//import ../parse
//import ./handleChild
//import ./setLogic
//import ./setChildren
//import ./setCss
//import ./setExtTplData
//import ./destroy

var render_control_render_moduleAttrName = 's-module';
var render_control_render_moduleAttrValue = 'ismodule';

function render_control_render(resContainer) {
    var boxId = resContainer.boxId;
    if (!resContainer.dataReady || !resContainer.tplReady || resContainer.rendered) {
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
        try {
            html = tplFn(retData);
        } catch (e) {
            render_error(e);
            return;
        }
        resContainer.html = html;
    }
    if (!resContainer.cssReady) {
        return;
    }

    //子模块分析
    resContainer.childrenid = {};
    var tplParseResult = render_parse(html);
    resContainer.stageScrollId = undefined;
    //去掉节点上的资源信息
    for (var i = 0, len = tplParseResult.length; i < len; i++) {
        parseResultEle = tplParseResult[i];
        if (parseResultEle['s-stage-scroll']) {
            resContainer.stageScrollId = parseResultEle['s-id'];
            html = html.replace(parseResultEle['s-all'], parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        } else {
            html = html.replace(parseResultEle['s-all'], ' ' + render_control_render_moduleAttrName + '=' + render_control_render_moduleAttrValue + ' ' + parseResultEle['s-all'] + ' id=' + parseResultEle['s-id']);
        }
    }
    resContainer.html = html;
    ////
    //1. box存在，addHTML，运行logic，运行子队列（子模块addHTML）
    //2. box不存在，则进入队列，待渲染
    ////@finrila 由于做场景管理时需要BOX是存在的，所以调整渲染子模块流程到写入HTML后再处理子模块，那么每个模块的box在页面上是一定存在的了
    var box = getElementById(boxId);

    render_control_destroyLogic(resContainer);
    render_control_destroy(resContainer.toDestroyChildrenid, false);
    box.innerHTML = html;
    render_base_count--;
    resContainer.rendered = true;
    setTimeout(function() {
        render_control_startLogic(resContainer);
        render_control_handleChild(boxId, tplParseResult);
    });
    render_control_destroyCss(resContainer, true);

    // 因为所有模块的Box必然存在，所以不需要有等待队列了
    if (render_base_count <= 0) {
        core_notice_trigger('allDomReady');
    }
}