//import ./base

function loader_config(config) {
	if ('version' in config) {
		loader_base_version = config;
	}
}

config_push(loader_config);