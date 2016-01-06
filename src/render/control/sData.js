/**
 * s-data属性的特殊处理，当子模块节点中s-data的值为#sdata-开头时 从缓存中获取模块数据
 */
var render_control_sData_preFix = '#sdata-';
var render_control_sData_current_boxId;
var render_control_sData_s_data_index;
var render_control_sData_dataMap = {};

function render_control_sData(data) {
    var dataId = render_control_sData_preFix + render_control_sData_current_boxId + '-' + (render_control_sData_s_data_index++);
    render_control_sData_dataMap[render_control_sData_current_boxId][dataId] = data || {};
    return dataId;
}

function render_control_sData_setBoxId(boxId) {
    render_control_sData_current_boxId = boxId;
    render_control_sData_s_data_index = 0;
    render_control_sData_dataMap[boxId] = {};
}

function render_control_sData_getData(dataId) {
    var idMatch = dataId.match(RegExp('^' + render_control_sData_preFix + '(.*)-\\d+$'));
    if (idMatch) {
        return render_control_sData_dataMap[idMatch[1]][dataId];
    }
}

function render_control_sData_delData(boxId) {
    delete render_control_sData_dataMap[boxId];
}