//import core/object/typeof

//用户扩展类
function render_control_setExtTplData_F() {}

//用户扩展全局功能方法
function render_control_setExtTplData(obj) {
    if (core_object_typeof(obj) !== 'object') {
        throw 'The method "steel.setExtTplData(obj)" used in your app need an object as the param.';
    }
    render_control_setExtTplData_F.prototype = obj;
    render_control_setExtTplData_F.prototype.constructor = render_control_setExtTplData_F;
}