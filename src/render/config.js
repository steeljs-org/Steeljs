//import config
//import ./base
//import ./stage

config_push(function(parseParamFn) {
    if (isHTML5) {
        render_base_dataCache_usable = parseParamFn('dataCache', render_base_dataCache_usable);
        if ((iphone && iphoneVersion >= 8.0 && webkit) || (android && androidVersion >= 4.4 && webkit)) {
            // return;
            //目前限制使用这个功能，这个限制会优先于用户的配置
            render_base_stage_usable = parseParamFn('stage', render_base_stage_usable);
            if (render_base_stage_usable) {
                render_base_stageCache_usable = parseParamFn('stageCache', render_base_stageCache_usable);
                render_base_stageChange_usable = parseParamFn('stageChange', render_base_stageChange_usable);
                render_base_stageDefaultHTML = parseParamFn('stageDefaultHTML', render_base_stageDefaultHTML);
                render_base_stage_maxLength = parseParamFn('stageMaxLength', render_base_stage_maxLength);
            }
        }
    }
});