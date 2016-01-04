/**
 * event对象属性适配
 */

function core_event_eventFix(e) {
    e.target = e.target || e.srcElement;
}