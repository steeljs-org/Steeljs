//import base
//import core/notice
//import core/array/makeArray


function render_error() {
    var args = core_array_makeArray(arguments);
    core_notice_trigger.apply(undefined, ['renderError'].concat(args));
}