//import ./base
//import core/parseURL
//import ./router
//import ./makeParams

function router_match(url) {
    url = url || location.toString();
    var routerParams = router_makeParams(url);
    var path = routerParams.path;// store values
    var m = [];//正则校验结果；

    for (var i = 0, len = router_base_routerTableReg.length; i < len; i++) {
        var obj = router_base_routerTableReg[i];
        if ((m = obj['pathRegexp'].exec(path))) {
            var keys = obj['keys'];
            var params = routerParams.params;
            var prop;
            var n = 0;
            var key;
            var val;

            for (var j = 1, len = m.length; j < len; ++j) {
                key = keys[j - 1];
                prop = key
                    ? key.name
                    : n++;
                val = router_match_decodeParam(m[j]);

                if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
                    params[prop] = val;
                }
            }
            return obj['controller'];
        }
    }

    return false;
}

function router_match_decodeParam(val) {
    if (typeof val !== 'string') {
        return val;
    }

    try {
        return decodeURIComponent(val);
    } catch (e) {
        throw new Error("Failed to decode param '" + val + "'");
    }
}
