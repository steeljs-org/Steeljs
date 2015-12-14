//import ./fixUrl
//import ./queue
//import ./cache
//import loader/jsloader
//import loader/cssloader
//import resource/request
//import resource/realUrl
//import ./newcache

var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle(resource_fixUrl(name, 'js'), succ, err, loader_js);
    },

    css: function(name, succ, err, cssId) {
        resource_res_handle(resource_fixUrl(name, 'css'), succ, err, loader_css, cssId);
    },

    get: function(name, succ, err, ajax_cache) {
        var keys = [];
        var alias_url = resource_fixUrl(name, 'ajax');
        var realUrl = resource_realUrl(alias_url, keys);
        var cache = resource_newcache_get.ajax(realUrl, keys);

        if (ajax_cache && cache) {
            succ(cache, alias_url);
            return;
        }
        
        resource_res_handle(realUrl, succ, err, resource_request, '', keys);//loader_ajax);
    }
};

function resource_res_handle(url, succ, err, loader, cssId, keys) {
    //check 缓存
    // var cache = resource_cache_get(url);
    // if(cache){
    //     succ(cache.data);
    //     return;
    // }

    //check 队列    
    if(resource_queue_list[url]){
        resource_queue_push(url, succ, err);
    }else {
        resource_queue_create(url);
        resource_queue_push(url, succ, err);
        //loader
        loader(url, function(access, data) {
            if (data) {
                resource_newcache_set.ajax(url, { data: data, expire: new Date().getTime() })
            }
            // resource_cache_create(url);
            // resource_cache_set(url, {
            //     data: data,
            //     expire: null
            // });

            data = resource_res_realData(data);
            resource_queue_run(url, access, data);
            resource_queue_del(url);
        }, cssId);
    }
};

function resource_res_realData(data, keys) {
    for (var i = 0; i < keys.length; i++) {
        data = data[keys[i]] || data;
    }

    return data;
}