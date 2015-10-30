/*
 * to decide whether Element A contains Element B;
 * @method core_dom_contains
 * @private
 * @param {Element} parent
 * @param {Element} node
 * @return {boolean}
 */
//var core_dom_contains = docElem.compareDocumentPosition ? function( parent, node ) {
//	return parent && node && !!( parent.compareDocumentPosition( node ) & 16 );
//} : function( parent, node ) {
//	return parent && node && parent !== node && ( parent.contains ? parent.contains( node ) : true );
//};
var core_dom_contains = docElem.contains ?
	function( parent, node ) {
		parent = parent === document ? docElem : parent;
		node = node.parentNode;
		return parent === node || !!( node && parent.contains && parent.contains( node ) );
	} :
	docElem.compareDocumentPosition ?
	function( parent, node ) {
		return !!( parent.compareDocumentPosition( node ) & 16 );
	} :
	function( parent, node ) {
		while ( node = node.parentNode ) {
			if ( node === parent ) {
				return true;
			}
		}
		return false;
	};