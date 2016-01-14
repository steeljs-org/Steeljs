//import core/dom/createElement
//import core/uniqueKey
//import core/dom/removeNode
//import core/URL

function loader_js(url, callback){
    var entityList = {};
    var opts = {
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'args': {},
        'isEncode' : false
    };
    
    var js, requestTimeout;
    
    var uniqueID = core_uniqueKey();
    
    js = entityList[uniqueID];
    if (js != null && !IE) {
        core_dom_removeNode(js);
        js = null;
    }
    if (js == null) {
        js = entityList[uniqueID] = core_dom_createElement('script');
    }
    
    js.charset = opts.charset;
    js.id = 'scriptRequest_script_' + uniqueID;
    js.type = 'text/javascript';
    if (callback != null) {
        if (IE) {
            js['onreadystatechange'] = function(){
                if (js.readyState.toLowerCase() == 'loaded' || js.readyState.toLowerCase() == 'complete') {
                    try{
                        clearTimeout(requestTimeout);
                        head.removeChild(js);
                        js['onreadystatechange'] = null;
                    }catch(exp){
                        
                    }
                    callback(true);
                }
            };
        }
        else {
            js['onload'] = function(){
                try{
                    clearTimeout(requestTimeout);
                    core_dom_removeNode(js);
                }catch(exp){}
                callback(true);
            };
            
        }
        
    }
    
    js.src = core_URL(url,{
        'isEncodeQuery' : opts['isEncode']
    }).setParams(opts.args).toString();
    
    head.appendChild(js);
    
    if (opts.timeout > 0) {
        requestTimeout = setTimeout(function(){
            try{
                head.removeChild(js);
            }catch(exp){
                
            }
            callback(false);
        }, opts.timeout);
    }
    return js;
}