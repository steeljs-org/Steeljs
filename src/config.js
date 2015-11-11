//import base

var config_list = [];

steel.config = function(config) {
  var parseParamFn = config_parseParamFn(config);
  for (var i = 0, l = config_list.length; i < l; ++i) {
    config_list[i](parseParamFn, config);
  }
};

function config_push(fn) {
  config_list.push(fn);
}

function config_parseParamFn(config) {
  return function(key, defaultValue) {
    if (key in config) {
      return config[key];
    }
    return defaultValue;
  };
}