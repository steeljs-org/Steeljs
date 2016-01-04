/**
 * querySelectorAll
 * 在非h5下目前只支持标签名和属性选择如div[id=fsd],属性值不支持通配符
 */

var core_dom_querySelectorAll_REG1 = /([^\[]*)(?:\[([^\]=]*)=?['"]?([^\]]*?)['"]?\])?/;

function core_dom_querySelectorAll(dom, select) {
	var result;
	var matchResult;
	var matchTag;
	var matchAttrName;
	var matchAttrValue;
	var elements;
	var elementAttrValue;
	if (dom.querySelectorAll) {
		result = dom.querySelectorAll(select);
	} else {
		if (matchResult = select.match(core_dom_querySelectorAll_REG1)) {
			matchTag = matchResult[1];
			matchAttrName = matchResult[2];
			matchAttrValue = matchResult[3];
			result = getElementsByTagName(matchTag || '*', dom);
			if (matchAttrName) {
				elements = result;
				result = [];
				for (var i = 0, l = elements.length; i < l; ++i) {
					elementAttrValue = elements[i].getAttribute(matchAttrName);
					if (elementAttrValue !== null && (!matchAttrValue || elementAttrValue === matchAttrValue)) {
						result.push(elements[i])
					}
				}
			}
		}
	}
	return result || [];
}