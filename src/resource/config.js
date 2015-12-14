//import ./base

var resource_config_slash = '/';
var resource_config_ajaxExpries = 3600 * 1000;
function resource_config(config) {
    resource_jsPath = config.jsPath || resource_jsPath;
    resource_cssPath = config.cssPath || resource_jsPath;
    resource_ajaxPath = config.ajaxPath || resource_config_slash;
    resource_basePath = config.basePath || resource_config_slash;
    resource_define_apiRule = config.defApiRule || resource_define_apiRule;
}

config_push(resource_config);