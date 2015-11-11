//import ./base

var resource_config_slash = '/';
function resource_config(parseParamFn) {
    resource_jsPath = parseParamFn('jsPath', resource_jsPath);
    resource_cssPath = parseParamFn('cssPath', resource_cssPath);
    resource_ajaxPath = parseParamFn('ajaxPath', resource_ajaxPath);
    resource_basePath = parseParamFn('basePath', resource_config_slash);
    resource_define_apiRule = parseParamFn('defApiRule', resource_define_apiRule);
}

config_push(resource_config);