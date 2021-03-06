//import ./base
//import core/queryToJson
//import core/array/inArray
//import ./stage

//解析jade fun
function render_parse(jadeFunStr) {
    var g;
    var result = [];
    var ret = [];
    var reg = /<[a-z]+([^>]*?s-(child)[^>]*?)>/g;//|tpl|data|css|logic

    while (g = reg.exec(jadeFunStr)) {
        var ele = g[1].replace(/\\\"/g, '"');
        var oEle = ele.replace(/\"/g, '').replace(/ /g, '&');
        var eleObj = core_queryToJson(oEle);
        var id = render_base_idMaker();

        eleObj['s-id'] = id;
        eleObj['s-all'] = ele;
        result.push(eleObj);
    }

    reg = RegExp('(class=\"[^\]*?' + render_stage_scroll_class + '[^\]*?\")');
    if (g = reg.exec(jadeFunStr)) {
        result.push({
            's-stage-scroll': true,
            's-all': g[1].replace(/\\\"/g, '"'),
            's-id': render_base_idMaker()
        });
    }
    return result;
}