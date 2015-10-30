//import ./base
//import core/queryToJson
//import core/array/inArray

//解析jade fun
function render_parse(jadeFunStr){
    var g;
    var result = [];
    var ret = [];
    var reg = /<[a-z]+([^>]*?s-(child)[^>]*?)>/g;//|tpl|data|css|logic
    // var reg_child = /(s-child=[^ ]*)/g;
    
    while (g = reg.exec(jadeFunStr)){
        var ele = g[1].replace(/\\\"/g, '"');
        var oEle = ele.replace(/\"/g, '').replace(/ /g, '&');
        var eleObj = core_queryToJson(oEle);
        // var idKey = ele.match(reg_child).join();
        var id = render_base_idMaker();
        
        eleObj['s-id'] = id;
        eleObj['s-all'] = ele;
        result.push(eleObj);
    }
    // console.log(result);
    return result;
}