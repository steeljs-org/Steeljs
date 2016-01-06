//import core/object/isObject
//import ./sData

//用户扩展类
function render_control_setExtTplData_F() {}

render_control_setExtTplData_F.prototype.constructor = render_control_setExtTplData_F;
//用于帮助用户设置子模块数据的方法：steel_s_data(data) data为要设置的对象，设置后
render_control_setExtTplData_F.prototype.steel_s_data = render_control_sData;

//用户扩展全局功能方法
function render_control_setExtTplData(obj) {
    if (!core_object_isObject(obj)) {
        throw 'The method "steel.setExtTplData(obj)" used in your app need an object as the param.';
    }
    render_control_setExtTplData_F.prototype = obj;
    
}