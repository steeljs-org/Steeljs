//import ./base
//import ./runner

//全局define
function require_define(ns, deps, construtor) {
    if(require_ismodule_defined[ns]){
        return;
    }
    require_defineDeps[ns] = construtor ? deps : [];
    require_defineConstrutors[ns] = construtor || deps;
    /*//模块自执行
    if(require_dataMainId === ns){
        setTimeout(function(){
            require_runner([ns]);
        });
    }*/
    if((deps = require_defineDeps[ns]) && deps.length){
        setTimeout(function(){
            var loadList = [];
            for(var i = 0, l = deps.length; i < l; i++){
                var depNs = require_idFix(deps[i], require_nameToPath(ns));
                if(!require_ismodule_defined(depNs)){
                    loadList.push(depNs);
                }
            }
            if(loadList.length){
                require_global_loadingNum++;
                require_global(loadList, function(){
                    log(ns + ' deps loaded ok!', '');
                    setTimeout(function(){
                        require_global_loadingNum--;
                        require_main();
                    });
                },function(){
                    log(ns + ' deps loaded error!', '');
                });
            }else {
                require_main();
            }
        });
    }else {
        require_main();
    }
    function require_main(){
        clearTimeout(require_mainTimer);
        if(require_global_loadingNum < 1){
            // if(require_dataMainId === ns){
                require_mainTimer = setTimeout(function(){
                    if(require_dataMainId && require_ismodule_defined(require_dataMainId)){
                       require_runner([ns]); 
                    }
                    
                }, 10);
            // }
        }
    }
}