

function core_crossDomainCheck(url) {
    var urlPreReg = /^[^:]+:\/\/[^\/]+\//;
    var locationMatch = location.href.match(urlPreReg);
    var urlMatch = url.match(urlPreReg);
    return (locationMatch && locationMatch[0]) === (urlMatch && urlMatch[0]);
}