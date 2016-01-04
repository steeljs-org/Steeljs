//render_addHTML
function render_addHTML(node, html){
    if(IE && IE < 10){
        // node.insertAdjacentHTML('BeforeEnd', html);
        node.innerHTML = html;
    } else {
        var oRange, oFrage;
        oRange = node.ownerDocument.createRange();//node.ownerDocument.createRange();
        oRange.selectNodeContents(node);
        oFrage = oRange.createContextualFragment(html);
        node.appendChild(oFrage);
    }
}