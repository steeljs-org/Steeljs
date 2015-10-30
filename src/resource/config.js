//import ./base

var resource_config_slash = '/';
function resource_config(config) {
    resource_jsPath = config.jsPath;
    resource_cssPath = config.cssPath;
    resource_ajaxPath = config.ajaxPath || resource_config_slash;
    resource_basePath = config.basePath || resource_config_slash;
    resource_define_apiRule = config.defApiRule;
}

config_push(resource_config);