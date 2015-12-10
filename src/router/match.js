//import core/object/isObject
//import ./base
//import ./parseURL

function router_match(url) {
    var routerUrl = core_object_isObject(url) ? url : router_parseURL(url);
    var path = routerUrl.path;// store values

    for (var i = 0, len = router_base_routerTableReg.length; i < len; i++) {
        var obj = router_base_routerTableReg[i];
        var pathMatchResult;//正则校验结果；
        if (pathMatchResult = obj['pathRegexp'].exec(path)) {
            var keys = obj['keys'];
            var param = {};
            var prop;
            var n = 0;
            var key;
            var val;

            for (var j = 1, len = pathMatchResult.length; j < len; ++j) {
                key = keys[j - 1];
                prop = key ? key.name : n++;
                val = decodeURIComponent(pathMatchResult[j]);
                param[prop] = val;
            }

            return {
                config: obj['config'],
                param: param
            };
        }
    }
}
