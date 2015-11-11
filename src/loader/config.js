//import ./base

function loader_config(parseParamFn) {
  loader_base_version = parseParamFn('version', loader_base_version);
}

config_push(loader_config);