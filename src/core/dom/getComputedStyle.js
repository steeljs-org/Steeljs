/**
 * 得到节点的计算样式
 */

var core_dom_getComputedStyle = window.getComputedStyle ? function(node, property) {
    return getComputedStyle(node, '')[property];
} : function(node, property) {
    return node.currentStyle && node.currentStyle[property];
};