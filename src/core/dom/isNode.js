/**
 * is node
 * @id core_dom_isNode
 * @param {Element} node
 * @return {Boolean} true/false
 * @example
 * core_dom_isNode(getElementById('test')) == true;
 */
function core_dom_isNode(node) {
    return (node != undefined) && Boolean(node.nodeName) && Boolean(node.nodeType);   
}