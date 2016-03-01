//import core/object/parseParam
//import loader/ajax

function resource_request(url, callback) {
    return loader_ajax(url, function(response, params) {
        resource_request_apiRule(url, response, params, callback);
    }, function(response) {
        callback(false, response);
    });
}

function resource_request_apiRule(url, response, params, callback) {
    if (resource_base_apiRule) {
        resource_base_apiRule(response, params, callback);
    } else {
        if (response && response.code == '100000') {
            callback(true, response);
        } else {
            log('Error: response data url("' + url + '") : The api error code is ' + (response && response.code) + '. The error reason is ' + (response && response.msg));
            callback(false, response, params);
        }
    }
}
