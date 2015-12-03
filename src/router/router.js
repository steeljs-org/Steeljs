//router资源

//import ./base
//import ./listen

var router_api = {
    set: router_listen_setRouter,
    get: router_router_get
};

function router_router_get() {
    return router_base_params;
}