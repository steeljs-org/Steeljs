/**
 * router.use
 * 设置单条路由规则
 * 路由语法说明：
 * 1、path中的变量定义参考express
 * 2、支持query和hash
 * 3、低版浏览器支持用hash模式来设置路由
 */

//import ./base
//import ./pathToRegexp

function router_use(path, config) {
    var key, value, _results;
    if (typeof path === 'object' && !(path instanceof window.RegExp)) {
        //批量设置
        _results = [];
        for (key in path) {
            value = path[key];
            _results.push(router_use(key, value));
        }
        return _results;
    } else {
        //单条设置
        var keys = [];
        var pathRegexp = router_pathToRegexp(path, keys);
        return router_base_routerTableReg.push({
            pathRegexp: pathRegexp,
            config: config,
            keys: keys
        });
    }
}

