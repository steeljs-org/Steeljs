//import core/asyncCall

/** 
 * 资源队列管理
 * @params
 * url 请求资源地址
 * succ 
 * err
 * access 是否成功
 * data 资源数据
 */

function resource_queue_create(url){
    resource_queue_list[url] = [];
}

function resource_queue_push(url, succ, err){
    resource_queue_list[url].push([succ, err]);
}

function resource_queue_run(url, access, data){
	access = access ? 0 : 1;
    for(var i = 0, len = resource_queue_list[url].length; i < len; i++) {
        var item = resource_queue_list[url][i];
        try {
            item[access](data, url);
        } catch(e) {
            core_asyncCall(function(item) {
                item[1](data, url);
            }, [item]);
        }
    }
}

function resource_queue_del(url) {
    url in resource_queue_list && (delete resource_queue_list[url]);
}