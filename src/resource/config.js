//import ./base

var resource_config_slash = '/';

config_push(function (parseParamFn) {
    resource_jsPath = parseParamFn('jsPath', resource_jsPath);
    resource_cssPath = parseParamFn('cssPath', resource_cssPath);
    resource_ajaxPath = parseParamFn('ajaxPath', resource_ajaxPath);
    resource_basePath = parseParamFn('basePath', resource_config_slash);
    resource_base_apiRule = parseParamFn('defApiRule', resource_base_apiRule);
    resource_base_version = parseParamFn('version', resource_base_version);
});