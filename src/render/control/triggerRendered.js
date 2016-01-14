//import ../base

/**
 * 触发rendered事件
 */
function render_control_triggerRendered(boxId) {
    core_notice_trigger('rendered', {
        boxId: boxId,
        controller: render_base_controllerNs[boxId]
    });
}
