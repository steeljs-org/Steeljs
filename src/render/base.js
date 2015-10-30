/**
 * 公共对象方法定义文件
 */
//import require/global
//import core/uniqueKey

//control容器
var render_base_controlCache = {};
//controllerNs容器
var render_base_controllerNs = {};
//资源容器
var render_base_resContainer = {};
//render数量
var render_base_count = 0;

//id生成器
function render_base_idMaker(){
    return core_uniqueKey();
}
