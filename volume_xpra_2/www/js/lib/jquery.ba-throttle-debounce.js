!function(window,undefined){"$:nomunge";var jq_throttle,$=window.jQuery||window.Cowboy||(window.Cowboy={});$.throttle=jq_throttle=function(delay,no_trailing,callback,debounce_mode){function wrapper(){function exec(){last_exec=+new Date,callback.apply(that,args)}function clear(){timeout_id=undefined}var that=this,elapsed=+new Date-last_exec,args=arguments;debounce_mode&&!timeout_id&&exec(),timeout_id&&clearTimeout(timeout_id),debounce_mode===undefined&&elapsed>delay?exec():!0!==no_trailing&&(timeout_id=setTimeout(debounce_mode?clear:exec,debounce_mode===undefined?delay-elapsed:delay))}var timeout_id,last_exec=0;return"boolean"!=typeof no_trailing&&(debounce_mode=callback,callback=no_trailing,no_trailing=undefined),$.guid&&(wrapper.guid=callback.guid=callback.guid||$.guid++),wrapper},$.debounce=function(delay,at_begin,callback){return callback===undefined?jq_throttle(delay,at_begin,!1):jq_throttle(delay,callback,!1!==at_begin)}}(this);