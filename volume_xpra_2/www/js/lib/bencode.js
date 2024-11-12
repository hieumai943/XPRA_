function bencode(obj){if(null===obj||void 0===obj)throw"invalid: cannot encode null";switch(btypeof(obj)){case"string":return bstring(obj);case"number":return bint(obj);case"list":return blist(obj);case"dictionary":return bdict(obj);case"boolean":return bint(obj?1:0);default:throw"invalid object type in source: "+btypeof(obj)}}function uintToString(uintArray){for(var s="",slice=uintArray.slice,i=0,len=uintArray.length;i<len;i+=10400)s+=slice?String.fromCharCode.apply(null,uintArray.slice(i,Math.min(i+10400,len))):String.fromCharCode.apply(null,uintArray.subarray(i,Math.min(i+10400,len)));return s}function bdecode(buf){return buf.substr||(buf=uintToString(buf)),bparse(buf)[0]}function bparse(str){switch(str.charAt(0)){case"d":return bparseDict(str.substr(1));case"l":return bparseList(str.substr(1));case"i":return bparseInt(str.substr(1));default:return bparseString(str)}}function ord(c){return c.charCodeAt(0)}function bparseString(str){return str2=str.split(":",1)[0],isNum(str2)?(len=parseInt(str2),[str.substr(str2.length+1,len),str.substr(str2.length+1+len)]):null}function bparseInt(str){var str2=str.split("e",1)[0];return isNum(str2)?[parseInt(str2),str.substr(str2.length+1)]:null}function bparseList(str){for(var p,list=[];"e"!==str.charAt(0)&&str.length>0;){if(null===(p=bparse(str)))return null;list[list.length]=p[0],str=p[1]}if(str.length<=0)throw"unexpected end of buffer reading list";return[list,str.substr(1)]}function bparseDict(str){for(var key,val,dict={};"e"!==str.charAt(0)&&str.length>0;){if(null===(key=bparseString(str)))return;if(null===(val=bparse(key[1])))return null;dict[key[0]]=val[0],str=val[1]}return str.length<=0?null:[dict,str.substr(1)]}function isNum(str){return!isNaN(str.toString())}function btypeof(obj){var type=typeof obj;return"object"===type?void 0===obj.length?"dictionary":"list":type}function bstring(str){return str.length+":"+str}function bint(num){return"i"+num+"e"}function blist(list){var str;str="l";for(key in list)str+=bencode(list[key]);return str+"e"}function bdict(dict){var str;str="d";for(key in dict)str+=bencode(key)+bencode(dict[key]);return str+"e"}