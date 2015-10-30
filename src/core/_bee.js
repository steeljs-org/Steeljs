//监控系统接口

var core_bee = {
    log: function(code, msg, type, lv) {
        type = type || 'error';
        lv = lv || 'e';
        if (!isDebug && window.bee && window.bee[type]) {
            return window.bee[type]('[' + code + '] ' + msg, lv);
        }
    }, 
    timing: function(name, time) {
        if (!isDebug && window.bee && window.bee.timing) {
            return window.bee.timing(name, time);
        }
    }
};