//import ../base
//import ../run

function render_contorl_toTiggerChildren(resContainer) {
    if (resContainer.needToTriggerChildren) {
        var s_childIdMap = {};
        if (resContainer.childrenChanged) {
            for (var s_child in resContainer.s_childMap) {
                s_childIdMap[resContainer.s_childMap[s_child]] = true;
            }
        }

        for (var id in resContainer.childrenid) {
            if (s_childIdMap[id]) {
                continue;
            }
            var childControl = render_base_controlCache[id];
            if (childControl) {
                render_run(id, childControl._controller);
            }
        }
    }
    resContainer.needToTriggerChildren = false;
}