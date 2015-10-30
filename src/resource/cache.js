//import ./base

/*
 * 缓存管理
 * @params
 * obj
 * {
 *   data: data,// 资源数据
 *   expire: null //过期时间
 * }
 */

function resource_cache_create(url) {
	resource_cache_list[url] = [];
}

function resource_cache_set(url, obj) {
	resource_cache_list[url].data = obj.data;
	resource_cache_list[url].expire = obj.expire;
}

function resource_cache_get(url) {
	return resource_cache_list[url];
}

function resource_cache_del(url) {
	if (url in resource_cache_list[url]) {
		delete resource_cache_list[url];
	}
}