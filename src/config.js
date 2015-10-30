//import base

var config_list = [];

config_push(function(config) {
	if ('debug' in config) {
		isDebug = config.debug
	}
	mainBox = config.mainBox;
});

steel.config = function(config) {
  for (var i = 0, l = config_list.length; i < l; ++i) {
    config_list[i](config);
  }
};

function config_push(fn) {
  config_list.push(fn);
}
