"use strict";var Utilities={VERSION:"4.2",REVISION:882,LOCAL_MODIFICATIONS:0,BRANCH:"master",exc:function(){console&&console.error.apply(console,arguments)},error:function(){console&&console.error.apply(console,arguments)},warn:function(){console&&console.log.apply(console,arguments)},log:function(){console&&console.log.apply(console,arguments)},debug:function(){console&&console.debug.apply(console,arguments)},cexc:function(){console&&console.error.apply(console,arguments)},cerror:function(){console&&console.error.apply(console,arguments)},cwarn:function(){console&&console.log.apply(console,arguments)},clog:function(){console&&console.log.apply(console,arguments)},cdebug:function(){console&&console.debug.apply(console,arguments)},getHexUUID:function(){for(var s=[],hexDigits="0123456789abcdef",i=0;i<36;i++)s[i]=8==i||13==i||18==i||23==i?"-":hexDigits.substr(Math.floor(16*Math.random()),1);return s.join("")},getSalt:function(l){if(l<32||l>256)throw"invalid salt length";for(var s="";s.length<l;)s+=Utilities.getHexUUID();return s.slice(0,l)},xorString:function(str1,str2){var result="";if(str1.length!==str2.length)throw"strings must be equal length";for(var i=0;i<str1.length;i++)result+=String.fromCharCode(str1[i].charCodeAt(0)^str2[i].charCodeAt(0));return result},trimString:function(str,trimLength){return str.length>trimLength?str.substring(0,trimLength-3)+"...":str},getPlatformProcessor:function(){return navigator.oscpu?navigator.oscpu:navigator.hasOwnProperty("cpuClass")?navigator.cpuClass:"unknown"},getPlatformName:function(){return navigator.appVersion.includes("Win")?"Microsoft Windows":navigator.appVersion.includes("Mac")?"Mac OSX":navigator.appVersion.includes("Linux")?"Linux":navigator.appVersion.includes("X11")?"Posix":"unknown"},getPlatform:function(){return navigator.appVersion.includes("Win")?"win32":navigator.appVersion.includes("Mac")?"darwin":navigator.appVersion.includes("Linux")?"linux":navigator.appVersion.includes("X11")?"posix":"unknown"},getFirstBrowserLanguage:function(){var language,nav=window.navigator,browserLanguagePropertyKeys=["language","browserLanguage","systemLanguage","userLanguage"];if(Array.isArray(nav.languages))for(var i=0;i<nav.languages.length;i++)if((language=nav.languages[i])&&language.length)return language;for(var i=0;i<browserLanguagePropertyKeys.length;i++){if((language=nav[browserLanguagePropertyKeys[i]])&&language.length)return language}return null},getKeyboardLayout:function(){var v=Utilities.getFirstBrowserLanguage();if(Utilities.debug("getFirstBrowserLanguage()=",v),null==v)return"us";var layout=LANGUAGE_TO_LAYOUT[v];if(!layout){v=v.split(",")[0];var l=v.split("-",2);1===l.length&&(l=v.split("_",2)),layout=l[0].toLowerCase();var tmp=LANGUAGE_TO_LAYOUT[v];tmp&&(layout=tmp)}return Utilities.debug("getKeyboardLayout()=",layout),layout},canUseWebP:function(){var elem=document.createElement("canvas");return!!elem.getContext("2d")&&0==elem.toDataURL("image/webp").indexOf("data:image/webp")},getAudioContextClass:function(){return window.AudioContext||window.webkitAudioContext||window.audioContext},getAudioContext:function(){if(Utilities.audio_context)return Utilities.audio_context;var acc=Utilities.getAudioContextClass();return acc?(Utilities.audio_context=new acc,Utilities.audio_context):null},isMacOS:function(){return navigator.platform.includes("Mac")},isWindows:function(){return navigator.platform.includes("Win")},isLinux:function(){return navigator.platform.includes("Linux")},isFirefox:function(){return navigator.userAgent.toLowerCase().includes("firefox")},isOpera:function(){return navigator.userAgent.toLowerCase().includes("opera")},isSafari:function(){var ua=navigator.userAgent.toLowerCase();return ua.includes("safari")&&!ua.includes("chrome")},isEdge:function(){return navigator.userAgent.includes("Edge")},isChrome:function(){var isChromium=window.hasOwnProperty("chrome"),winNav=window.navigator,vendorName=winNav.vendor,isOpera=winNav.userAgent.includes("OPR"),isIEedge=winNav.userAgent.includes("Edge");return!!winNav.userAgent.match("CriOS")||null!==isChromium&&void 0!==isChromium&&"Google Inc."===vendorName&&!1===isOpera&&!1===isIEedge},isIE:function(){return navigator.userAgent.includes("MSIE")||navigator.userAgent.includes("Trident/")},is_64bit:function(){var _to_check=[];window.navigator.hasOwnProperty("cpuClass")&&_to_check.push((window.navigator.cpuClass+"").toLowerCase()),window.navigator.platform&&_to_check.push((window.navigator.platform+"").toLowerCase()),navigator.userAgent&&_to_check.push((navigator.userAgent+"").toLowerCase());for(var _64bits_signatures=["x86_64","x86-64","Win64","x64;","amd64","AMD64","WOW64","x64_64","ia64","sparc64","ppc64","IRIX64"],_c=0;_c<_to_check.length;_c++)for(var _i=0;_i<_64bits_signatures.length;_i++)if(-1!=_to_check[_c].indexOf(_64bits_signatures[_i].toLowerCase()))return!0;return!1},isMobile:function(){return/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)},getSimpleUserAgentString:function(){return Utilities.isFirefox()?"Firefox":Utilities.isOpera()?"Opera":Utilities.isSafari()?"Safari":Utilities.isChrome()?"Chrome":Utilities.isIE()?"MSIE":""},getColorGamut:function(){return window.matchMedia?window.matchMedia("(color-gamut: rec2020)").matches?"rec2020":window.matchMedia("(color-gamut: p3)").matches?"P3":window.matchMedia("(color-gamut: srgb)").matches?"srgb":"":""},isEventSupported:function(event){var isSupported,testEl=document.createElement("div");return event="on"+event,isSupported=event in testEl,isSupported||(testEl.setAttribute(event,"return;"),isSupported="function"==typeof testEl[event]),testEl=null,isSupported},normalizeWheel:function(event){var sX=0,sY=0;"detail"in event&&(sY=event.detail),"wheelDelta"in event&&(sY=-event.wheelDelta/120),"wheelDeltaY"in event&&(sY=-event.wheelDeltaY/120),"wheelDeltaX"in event&&(sX=-event.wheelDeltaX/120),"axis"in event&&event.axis===event.HORIZONTAL_AXIS&&(sX=sY,sY=0);var pX=10*sX,pY=10*sY;return"deltaY"in event&&(pY=event.deltaY),"deltaX"in event&&(pX=event.deltaX),(pX||pY)&&event.deltaMode&&(1==event.deltaMode?(pX*=40,pY*=40):(pX*=800,pY*=800)),pX&&!sX&&(sX=pX<1?-1:1),pY&&!sY&&(sY=pY<1?-1:1),{spinX:sX,spinY:sY,pixelX:pX,pixelY:pY,deltaMode:event.deltaMode||0}},saveFile:function(filename,data,mimetype){var a=document.createElement("a");a.setAttribute("style","display: none"),document.body.appendChild(a);var blob=new Blob([data],mimetype),url=window.URL.createObjectURL(blob);navigator.msSaveOrOpenBlob?navigator.msSaveOrOpenBlob(blob,filename):(a.href=url,a.download=filename,a.click(),window.URL.revokeObjectURL(url))},monotonicTime:function(){return performance?Math.round(performance.now()):Date.now()},StringToUint8:function(str){for(var u8a=new Uint8Array(str.length),i=0,j=str.length;i<j;++i)u8a[i]=str.charCodeAt(i);return u8a},Uint8ToString:function(u8a){for(var c=[],i=0;i<u8a.length;i+=32768)c.push(String.fromCharCode.apply(null,u8a.subarray(i,i+32768)));return c.join("")},ArrayBufferToBase64:function(uintArray){var s="";if(uintArray.subarray)for(var i=0,len=uintArray.length;i<len;i+=10400)s+=String.fromCharCode.apply(null,uintArray.subarray(i,Math.min(i+10400,len)));else for(var i=0,len=uintArray.length;i<len;i+=10400)s+=String.fromCharCode.apply(null,uintArray.slice(i,Math.min(i+10400,len)));return window.btoa(s)},convertDataURIToBinary:function(dataURI){for(var base64Index=dataURI.indexOf(";base64,")+";base64,".length,base64=dataURI.substring(base64Index),raw=window.atob(base64),rawLength=raw.length,array=new Uint8Array(new ArrayBuffer(rawLength)),i=0;i<rawLength;i++)array[i]=raw.charCodeAt(i);return array},parseINIString:function(data){var regex={section:/^\s*\[\s*([^\]]*)\s*\]\s*$/,param:/^\s*([^=]+?)\s*=\s*(.*?)\s*$/,comment:/^\s*[;#].*$/},value={},lines=data.split(/[\r\n]+/),section=null;return lines.forEach(function(line){if(!regex.comment.test(line))if(regex.param.test(line)){var match=line.match(regex.param);section?value[section][match[1]]=match[2]:value[match[1]]=match[2]}else if(regex.section.test(line)){var match=line.match(regex.section);value[match[1]]={},section=match[1]}else 0==line.length&&section&&(section=null)}),value},ParseResponseHeaders:function(headerStr){var headers={};if(!headerStr)return headers;for(var headerPairs=headerStr.split("\r\n"),i=0;i<headerPairs.length;i++){var headerPair=headerPairs[i],index=headerPair.indexOf(": ");if(index>0){var key=headerPair.substring(0,index),val=headerPair.substring(index+2);headers[key]=val}}return headers},parseParams:function(q){for(var e,params={},a=/\+/g,r=/([^&=]+)=?([^&]*)/g,d=function(s){return decodeURIComponent(s.replace(a," "))};e=r.exec(q);)params[d(e[1])]=d(e[2]);return params},getparam:function(prop){var getParameter=window.location.getParameter;getParameter||(getParameter=function(key){return window.location.queryStringParams||(window.location.queryStringParams=Utilities.parseParams(window.location.search.substring(1))),window.location.queryStringParams[key]});var value=getParameter(prop);try{void 0===value&&void 0!==typeof sessionStorage&&(value=sessionStorage.getItem(prop))}catch(e){value=null}return value},getboolparam:function(prop,default_value){var v=Utilities.getparam(prop);return null===v?default_value:-1!==["true","on","1","yes","enabled"].indexOf(String(v).toLowerCase())},hasSessionStorage:function(){if("undefined"==typeof Storage)return!1;try{var key="just for testing sessionStorage support";return sessionStorage.setItem(key,"store-whatever"),sessionStorage.removeItem(key),!0}catch(e){return!1}},getConnectionInfo:function(){if(!navigator.hasOwnProperty("connection"))return{};var c=navigator.connection,i={};return c.type&&(i.type=c.type),c.hasOwnProperty("effectiveType")&&(i["effective-type"]=c.effectiveType),!isNaN(c.downlink)&&!isNaN(c.downlink)&&c.downlink>0&&isFinite(c.downlink)&&(i.downlink=Math.round(1e3*c.downlink*1e3)),c.hasOwnProperty("downlinkMax")&&!isNaN(c.downlinkMax)&&!isNaN(c.downlinkMax)&&c.downlinkMax>0&&isFinite(c.downlinkMax)&&(i["downlink.max"]=Math.round(1e3*c.downlinkMax*1e3)),!isNaN(c.rtt)&&c.rtt>0&&(i.rtt=c.rtt),i},json_action:function(uri,success_fn,error_fn,username,password){Utilities.log("json_action(",uri,", ",success_fn,", ",error_fn,")");var xhr=new XMLHttpRequest,url=uri;return uri.startsWith("/")&&(url=document.location.href.split("/connect.html")[0]+uri),xhr.open("GET",url,!0),username&&password&&xhr.setRequestHeader("Authorization","Basic "+btoa(username+":"+password)),xhr.responseType="json",xhr.addEventListener("load",function(){Utilities.log("loaded",url,"status",xhr.status);var status=xhr.status;200===status?success_fn(xhr,xhr.response):(Utilities.log(uri,"failed:",status+xhr.response),error_fn&&error_fn("failed: "+status+xhr.response))}),xhr.addEventListener("error",function(e){Utilities.log(uri,"error:",e),error_fn&&error_fn(e)}),xhr.addEventListener("abort",function(e){Utilities.log(uri,"abort:",e),error_fn&&error_fn(e)}),xhr.send(),xhr}},MOVERESIZE_SIZE_TOPLEFT=0,MOVERESIZE_SIZE_TOP=1,MOVERESIZE_SIZE_TOPRIGHT=2,MOVERESIZE_SIZE_RIGHT=3,MOVERESIZE_SIZE_BOTTOMRIGHT=4,MOVERESIZE_SIZE_BOTTOM=5,MOVERESIZE_SIZE_BOTTOMLEFT=6,MOVERESIZE_SIZE_LEFT=7,MOVERESIZE_MOVE=8,MOVERESIZE_SIZE_KEYBOARD=9,MOVERESIZE_MOVE_KEYBOARD=10,MOVERESIZE_CANCEL=11,MOVERESIZE_DIRECTION_STRING={0:"SIZE_TOPLEFT",1:"SIZE_TOP",2:"SIZE_TOPRIGHT",3:"SIZE_RIGHT",4:"SIZE_BOTTOMRIGHT",5:"SIZE_BOTTOM",6:"SIZE_BOTTOMLEFT",7:"SIZE_LEFT",8:"MOVE",9:"SIZE_KEYBOARD",10:"MOVE_KEYBOARD",11:"CANCEL"},MOVERESIZE_DIRECTION_JS_NAME={0:"nw",1:"n",2:"ne",3:"e",4:"se",5:"s",6:"sw",7:"w"},LANGUAGE_TO_LAYOUT={en_GB:"gb",en:"us",zh:"cn",af:"za",sq:"al",ca:"ca","zh-TW":"tw","zh-CN":"cn",cs:"cz",da:"dk","nl-BE":"be","en-US":"us","en-AU":"us","en-GB":"gb","en-CA":"ca","en-NZ":"us","en-IE":"ie","en-ZA":"za","en-JM":"us","en-TT":"tr",et:"ee",fa:"ir","fr-BE":"be","fr-CA":"ca","fr-CH":"ch","fr-LU":"fr","gd-IE":"ie","de-CH":"ch","de-AT":"at","de-LU":"de","de-LI":"de",he:"il",hi:"in","it-CH":"ch",ja:"jp",ko:"kr","pt-BR":"br",pt:"pt",sr:"rs",sl:"si",es:"es",sv:"se","sv-FI":"fi",tr:"tr",uk:"ua",ur:"pk",vi:"vn"};