//import core/array/makeArray
/**
 * 模块渲染和运行时的错误触发
 * @param  {object} resContainer 资源容器
 * @param  {string} type         错误类型
 * @param  {any} ...         错误信息
 * @return {undefined}          
 */
function render_control_triggerError(resContainer, type) {
    var args = core_array_makeArray(arguments).slice(1);
    log.apply(undefined, ['Error: render'].concat(args));
    core_notice_trigger.apply(undefined, [resContainer.boxId + 'error'].concat(args))
}