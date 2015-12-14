//import ./storage
//import ./res

/** 
 * 获取缓存工具
 * @params
 * key 存储键
 * value 存储值
 */

//不知道哪里设置config，先写这里
var config = {
	expire: 5 * 60 * 1000
}

var resource_newcache_get = {
	ajax: function(url, keys) {
		var timestamp = new Date().getTime();
		var cacheData = JSON.parse(resource_storage_get(url));

		if (timestamp - cacheData.expire < config.expire) {
			return resource_res_realData(cacheData.data, keys);
		}

		return null;
	},
	js: function(url) {
		return null;
	},
	css: function(url) {
		return null;
	}
};

var resource_newcache_set = {
	ajax: function(url, data) {
		var cacheData = {
			expire: new Date().getTime(),
			data: data
		};

		resource_storage_set(url, JSON.stringify(cacheData));
	},
	js: function(url, data) {
		return null;
	},
	css: function(url, data) {
		return null;
	}
};