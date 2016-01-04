/*
 * 返回指定ID或者DOM的节点句柄
 * @method core_dom_removeNode
 * @private
 * @param {Element} node 节点对象
 * @example
 * core_dom_removeNode( node );
 */
function core_dom_removeNode( node ) {
	node && node.parentNode && node.parentNode.removeChild( node );
}