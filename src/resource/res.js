//import ./fixUrl
//import ./queue
//import loader/jsloader
//import loader/cssloader
//import resource/request

var resource_res = {
    js: function(name, succ, err) {
        resource_res_handle(resource_fixUrl(name, 'js'), succ, err, loader_js);
    },

    css: function(name, succ, err, cssId) {
        resource_res_handle(resource_fixUrl(name, 'css'), succ, err, loader_css, cssId);
    },

    get: function(name, succ, err) {
        resource_res_handle(resource_fixUrl(name, 'ajax'), succ, err, resource_request);//loader_ajax);
    }
};

function resource_res_handle(url, succ, err, loader, cssId) {

    //check 队列    
    if(resource_queue_list[url]){
        resource_queue_push(url, succ, err);
    }else {
        resource_queue_create(url);
        resource_queue_push(url, succ, err);
        //loader
        loader(url, function(access, data) {
            resource_queue_run(url, access, data);
            resource_queue_del(url);
        }, cssId);
    }
}