
var core_dom_className_blankReg = / +/g;
/**
 * classname编辑工具
 */
function core_dom_className(node, addNames, delNames) {
    var oldClassName = ' ' + (node.className || '').replace(core_dom_className_blankReg, '  ') + ' ';
    addNames = addNames || '';
    delNames = (addNames + ' ' +(delNames || '')).replace(core_dom_className_blankReg, '|').replace(/^\||\|$/, '');
    node.className = oldClassName.replace(RegExp(' (' + delNames + ') ', 'ig'), ' ') + ' ' + addNames;
}