//router资源

//import core/notice
//import core/fixUrl
//import ./base
//import ./listen
//import core/crossDomainCheck
//import ./makeParams

var router_router = {
    set: router_listen_setRouter,
    get: router_router_get
};

function router_router_get() {
    if (!router_base_params) {
        router_base_params = router_makeParams(location.toString());
    }
    return router_base_params;
}
