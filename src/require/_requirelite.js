/**
 * requirelite
 * wangzheng4@Finrila
 */
(function(window) {

    if (window.define) {
        return;
    }

    var toString = Object.prototype.toString;
    var document = window.document;
    var setTimeout = window.setTimeout;

    var defineList = {};
    var depsList = {};
    var realList = {};

    var data_main_id;
    var run_main_timer;
    var global_loading_num = 0;

    var defineConfig = {
        'baseUrl': './',
        'paths': {}
    };
    //exports
    global_require.config = require_config;
    global_require.isdefined = isdefined;
    window.define = global_define;
    window.require = global_require;

    //调用入口的获取
    (function() {
        var scripts = getElementsByTagName('script');
        var lastScript = scripts[scripts.length - 1];
        data_main_id = lastScript && lastScript.getAttribute('data-main') || data_main_id;
    })();

        function isdefined(id) {
            return !!defineList[id];
        }
        function isrunned(id) {
            return id in realList;
        }
    function log(a, b) {
        if (defineConfig.debug && window.console) {
            console.log(a, b);
        }
    }

    function idFix(id, basePath) {
        if (id.indexOf('.') === 0) {
            id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
        }
        while (id.indexOf('../') != -1) {
            id = id.replace(/\w+\/\.\.\//, '');
        }
        return id;
    }

    function nameToPath(name) {
        return name.substr(0, name.lastIndexOf('/') + 1);
    }

    // 运行define列表并返回实例集
    function pkg_runer(pkg, basePath) {
        var name;
        var task;
        var module;
        var once = [];

        for (var i = 0, l = pkg.length; i < l; i++) {
            name = pkg[i];
            name = idFix(name, basePath);
            if (name == 'require') {
                once.push(local_require(name));
                continue;
            }
            task = defineList[name];
            // 如果对应的名字未define
            if (!task) {
                once.push(undefined);
            } else {
                if (!isrunned(name)) {
                    if (depsList[name]) {
                        pkg_runer(depsList[name], nameToPath(name));
                    }
                    module = {
                        exports: {}
                    };
                    var result;
                    try {
                        result = task.apply(this, [local_require(name), module.exports, module]) || module.exports;
                    } catch (e) {
                        log(e.massage, e.stack);
                    }
                    realList[name] = result;
                }
                once.push(realList[name]);
            }
        }
        return once;
    }

    // 内部require
    function local_require(name) {
        log('local_require', name);
        var basePath = nameToPath(name);

        require.config = require_config;

        return require;

        function require(id) {
            if (toString.call(id).toLowerCase().indexOf('array') != -1) {
                return global_require.apply(this, arguments);
            }
            id = idFix(id, basePath);
            if (!isdefined(id)) {
                log('[' + id + '] 依赖未定义!', '');
            }
            if (!isrunned(id)) {
                pkg_runer([id]);
            }
            return realList[id];
        }
    }
    // 全局加载器
    function global_loader(pkg, cb, errorcb) {
        var queryVersion = defineConfig.queryVersion;
        queryVersion = queryVersion ? '?' + queryVersion : '';
        var i, len;
        var loaded = 0;
        //var list = [];
        var path;
        var error = false;
        var error_list = [];

        function check() {
            log('loader check:', loaded + ',' + pkg.length);
            if (pkg.length == loaded) {
                if (error) {
                    if (errorcb) {
                        errorcb();
                    }
                    log('以下文件加载失败\n\n' + error_list.join('\n') + '\n\n', '');
                } else {
                    cb();
                }
            }
        }

        function loader(src) {
            var script;
            script = document.createElement('script');
            script.src = src;

            script.onerror = function() {
                error = true;
                error_list.push(script.src);
                loaded += 1;
                script.onerror = null;
                check();
            };
            script.onload = script.onreadystatechange = function() {
                // 如果没有readyState也跳过
                if (!script.readyState || /load|complete/.test(script.readyState)) {
                    loaded += 1;
                    script.onload = script.onreadystatechange = null;
                    check();
                }
            };
            getElementsByTagName('head')[0].appendChild(script);
        }
        // 循环异步加载远端
        for (i = 0, len = pkg.length; i < len; i++) {
            if (defineConfig.paths[pkg[i]]) {
                path = defineConfig.paths[pkg[i]];
            } else {
                path = pkg[i];
            }
            // 如果是 file:// 或 http:// 则直接加载
            if (!/^\.|^\/|^\w+\:\/\//.test(path)) {
                path = defineConfig.baseUrl + path + '.js' + queryVersion;
            }
            loader(path);
        }
    }
    // 全局define
    function global_define(id, deps, cb) {
        if (isdefined(id)) {
            return;
        }
        defineList[id] = cb || deps;
        depsList[id] = cb && deps;

        if ((deps = depsList[id]) && deps.length) {
            setTimeout(function() {
                var loadList = [];
                for (var i = 0, l = deps.length; i < l; ++i) {
                    var depId = idFix(deps[i], nameToPath(id));
                    if (!isdefined(depId)) {
                        loadList.push(depId);
                    }
                }
                if (loadList.length) {
                    global_loading_num++;
                    global_loader(loadList, function() {
                        log(id + ' deps loaded ok!', '');
                        setTimeout(function() {
                            global_loading_num--;
                            run_main();
                        });
                    }, function() {
                        log(id + ' deps loaded error!', '');
                    });
                } else {
                    run_main();
                }
            });
        } else {
            run_main();
        }

        function run_main() {
            clearTimeout(run_main_timer);
            if (global_loading_num < 1) {
                run_main_timer = setTimeout(function() {
                    if (data_main_id && defineList[data_main_id]) {
                        pkg_runer([data_main_id]);
                    }
                }, 20);
            }
        }

    }

    function require_config(config) {
        var attrs = ['baseUrl', 'debug', 'queryVersion'];        if (config) {
            for(var i = 0, l = attrs.length; i < l; ++i) {
                var attr = attrs[i];
                if (attr in config) {
                    defineConfig[attr] = config[attr];
                }
            }
            var paths = config.paths;
            if (paths) {
                for (var key in paths) {
                    defineConfig.paths[key] = paths[key];

                }
            }
        }
    }

    // 全局require
    function global_require(pkg, cb, errorcb) {
        var i, len;
        var miss_pkg = [];
        var cb_pkg = [];
        // 判断缺失依赖
        for (i = 0, len = pkg.length; i < len; i++) {
            if (!isdefined(pkg[i])) {
                miss_pkg.push(pkg[i]);
            }
        }
        // 加载缺失依赖
        if (miss_pkg.length > 0) {
            global_loader(miss_pkg, call_cb, errorcb);
        } else {
            call_cb();
        }

        function call_cb() {
            var runer_result = pkg_runer(pkg);
            if (cb) {
                cb.apply(this, runer_result);
            }
        }

    }
    
})(window);