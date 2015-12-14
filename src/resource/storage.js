/** 
 * 本地存储工具
 * @params
 * key 存储键
 * value 存储值
 */

var _storage = window.localStorage;

var resource_storage_set = function(item, value) {
	if (!_storage) return;
	try {
		_storage.setItem(item, escape(value));
	} catch (e) {
		_storage.clear();
	}
};

var resource_storage_get = function(item) {
	if (!_storage) return;
	return unescape(_storage.getItem(item));
};

var resource_storage_del = function(item) {
	if (!_storage) return;
	_storage.removeItem(item);
};

var resource_storage_clear = function() {
	if (!_storage) return;
	_storage.clear();
};