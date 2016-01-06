//import base
//import core/notice
//import core/array/makeArray


function render_error() {
	log(arguments);
    core_notice_trigger.apply(undefined, ['renderError'].concat(core_array_makeArray(arguments)));
}