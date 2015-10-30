//import core/object/parseParam
//import loader/ajax

function resource_request(url, callback) {
    var apiRule = resource_define_apiRule || onComplete;

    function onComplete(req, params, callback) {
        if (req && req.code == '100000') {
            callback(true, req);
        }else {
            log(url + ': The api error code is ' + (req && req.code) + '. The error reason is ' + (req && req.msg));
            callback(false, req, params);
        }
    }
    return loader_ajax(url, function(req, params) {
        apiRule(req, params, callback);
    });
}