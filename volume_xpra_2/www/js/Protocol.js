function XpraProtocolWorkerHost(){this.worker=null,this.packet_handler=null,this.packet_ctx=null}function XpraProtocol(){this.is_worker=!1,this.packet_handler=null,this.packet_ctx=null,this.websocket=null,this.raw_packets=[],this.cipher_in=null,this.cipher_in_block_size=null,this.cipher_out=null,this.rQ=[],this.sQ=[],this.mQ=[],this.header=[],this.process_interval=0}if(XpraProtocolWorkerHost.prototype.open=function(uri){var me=this;if(this.worker)return void this.worker.postMessage({c:"o",u:uri});this.worker=new Worker("js/Protocol.js"),this.worker.addEventListener("message",function(e){var data=e.data;switch(data.c){case"r":me.worker.postMessage({c:"o",u:uri});break;case"p":me.packet_handler&&me.packet_handler(data.p,me.packet_ctx);break;case"l":this.log(data.t);break;default:this.error("got unknown command from worker"),this.error(e.data)}},!1)},XpraProtocolWorkerHost.prototype.close=function(){this.worker.postMessage({c:"c"})},XpraProtocolWorkerHost.prototype.terminate=function(){this.worker.postMessage({c:"t"})},XpraProtocolWorkerHost.prototype.send=function(packet){this.worker.postMessage({c:"s",p:packet})},XpraProtocolWorkerHost.prototype.set_packet_handler=function(callback,ctx){this.packet_handler=callback,this.packet_ctx=ctx},XpraProtocolWorkerHost.prototype.set_cipher_in=function(caps,key){this.worker.postMessage({c:"z",p:caps,k:key})},XpraProtocolWorkerHost.prototype.set_cipher_out=function(caps,key){this.worker.postMessage({c:"x",p:caps,k:key})},XpraProtocol.prototype.close_event_str=function(event){var code_mappings={1000:"Normal Closure",1001:"Going Away",1002:"Protocol Error",1003:"Unsupported Data",1004:"(For future)",1005:"No Status Received",1006:"Abnormal Closure",1007:"Invalid frame payload data",1008:"Policy Violation",1009:"Message too big",1010:"Missing Extension",1011:"Internal Error",1012:"Service Restart",1013:"Try Again Later",1014:"Bad Gateway",1015:"TLS Handshake"},msg="";try{void 0!==code_mappings[event.code]?msg+="'"+code_mappings[event.code]+"' ("+event.code+")":msg+=""+event.code,event.reason&&(msg+=": '"+event.reason+"'")}catch(e){this.error("cannot parse websocket event:",e),msg="unknown reason"}return msg},XpraProtocol.prototype.open=function(uri){var me=this;this.raw_packets=[],this.rQ=[],this.sQ=[],this.mQ=[],this.header=[],this.websocket=null;try{this.websocket=new WebSocket(uri,"binary")}catch(e){return void this.packet_handler(["error",""+e],this.packet_ctx)}this.websocket.binaryType="arraybuffer",this.websocket.onopen=function(){me.packet_handler(["open"],me.packet_ctx)},this.websocket.onclose=function(event){me.packet_handler(["close",me.close_event_str(event)],me.packet_ctx)},this.websocket.onerror=function(event){me.packet_handler(["error",me.close_event_str(event)],me.packet_ctx)},this.websocket.onmessage=function(e){me.rQ.push(new Uint8Array(e.data)),setTimeout(function(){me.process_receive_queue()},this.process_interval)}},XpraProtocol.prototype.close=function(){this.websocket&&(this.websocket.onopen=null,this.websocket.onclose=null,this.websocket.onerror=null,this.websocket.onmessage=null,this.websocket.close(),this.websocket=null)},XpraProtocol.prototype.protocol_error=function(msg){this.error("protocol error:",msg),this.websocket.onopen=null,this.websocket.onclose=null,this.websocket.onerror=null,this.websocket.onmessage=null,this.header=[],this.rQ=[],this.packet_handler(["close",msg])},XpraProtocol.prototype.process_receive_queue=function(){for(;this.websocket&&this.do_process_receive_queue(););},XpraProtocol.prototype.error=function(){console&&console.error.apply(console,arguments)},XpraProtocol.prototype.log=function(){console&&console.log.apply(console,arguments)},XpraProtocol.prototype.do_process_receive_queue=function(){var i=0,j=0;if(this.header.length<8&&this.rQ.length>0){for(;this.header.length<8&&this.rQ.length>0;){var slice=this.rQ[0],needed=8-this.header.length,n=Math.min(needed,slice.length);for(i=0;i<n;i++)this.header.push(slice[i]);slice.length>needed?this.rQ[0]=slice.subarray(n):this.rQ.shift()}if(this.header[0]!==ord("P")){var msg="invalid packet header format: "+this.header[0];if(this.header.length>1){msg+=": ";for(var c in this.header)msg+=String.fromCharCode(c)}return this.protocol_error(msg),!1}}if(this.header.length<8)return!1;var proto_flags=this.header[1],proto_crypto=2&proto_flags;if(proto_crypto&&(proto_flags&=-3),8&proto_flags&&(proto_flags&=-9),proto_flags>1)return void this.protocol_error("we can't handle this protocol flag yet: "+proto_flags);var level=this.header[2];if(32&level)return this.protocol_error("lzo compression is not supported"),!1;var index=this.header[3];if(index>=20)return this.protocol_error("invalid packet index: "+index),!1;var packet_size=0;for(i=0;i<4;i++)packet_size*=256,packet_size+=this.header[4+i];var padding=0;proto_crypto&&(padding=this.cipher_in_block_size-packet_size%this.cipher_in_block_size,packet_size+=padding);var rsize=0;for(i=0,j=this.rQ.length;i<j;++i)rsize+=this.rQ[i].length;if(rsize<packet_size)return!1;this.header=[];var packet_data;if(this.rQ[0].length==packet_size)packet_data=this.rQ.shift();else for(packet_data=new Uint8Array(packet_size),rsize=0;rsize<packet_size;){var slice=this.rQ[0],needed=packet_size-rsize;slice.length>needed?(packet_data.set(slice.subarray(0,needed),rsize),rsize+=needed,this.rQ[0]=slice.subarray(needed)):(packet_data.set(slice,rsize),rsize+=slice.length,this.rQ.shift())}if(proto_crypto){this.cipher_in.update(forge.util.createBuffer(uintToString(packet_data)));var decrypted=this.cipher_in.output.getBytes();for(packet_data=[],i=0;i<decrypted.length;i++)packet_data.push(decrypted[i].charCodeAt(0));packet_data=new Uint8Array(packet_data.slice(0,-1*padding))}if(0!=level){var inflated;if(16&level){var length=packet_data[0]|packet_data[1]<<8|packet_data[2]<<16|packet_data[3]<<24;inflated=new Uint8Array(length);var uncompressedSize=LZ4.decodeBlock(packet_data,inflated,4);if(uncompressedSize<=0&&packet_size+uncompressedSize!=0)return this.protocol_error("failed to decompress lz4 data, error code: "+uncompressedSize),!1}else inflated=64&level?BrotliDecode(packet_data):new Zlib.Inflate(packet_data).decompress();packet_data=inflated}if(index>0){if(this.raw_packets[index]=packet_data,this.raw_packets.length>=4)return this.protocol_error("too many raw packets: "+this.raw_packets.length),!1}else{var packet=null;try{packet=1==proto_flags?PyRencoder.decode(Buffer.from(packet_data),"binary"):bdecode(packet_data);for(var index in this.raw_packets)packet[index]=this.raw_packets[index];this.raw_packets={}}catch(e){return this.error("error decoding packet",e),this.error("packet="+packet),this.raw_packets=[],this.rQ.length>0}try{if("draw"===packet[0]&&"scroll"!==packet[6]){var img_data=packet[7];if("string"==typeof img_data){var uint=new Uint8Array(img_data.length);for(i=0,j=img_data.length;i<j;++i)uint[i]=img_data.charCodeAt(i);packet[7]=uint}}if(this.is_worker){this.mQ[this.mQ.length]=packet;var me=this;setTimeout(function(){me.process_message_queue()},this.process_interval)}else this.packet_handler(packet,this.packet_ctx)}catch(e){this.error("error processing packet "+packet[0]+": "+e)}}return this.rQ.length>0},XpraProtocol.prototype.process_send_queue=function(){for(;0!==this.sQ.length&&this.websocket;){var packet=this.sQ.shift();if(!packet)return;var proto_flags=0,bdata=null;try{PyRencoder&&!this.cipher_out?(bdata=PyRencoder.encode(packet),proto_flags=1):bdata=bencode(packet)}catch(e){this.error("Error: failed to encode packet:",packet);continue}var payload_size=bdata.length;if(this.cipher_out){proto_flags=2;for(var padding_size=this.cipher_out_block_size-payload_size%this.cipher_out_block_size,i=0;i<padding_size;i++)bdata+=String.fromCharCode(padding_size);this.cipher_out.update(forge.util.createBuffer(bdata)),bdata=this.cipher_out.output.getBytes()}var actual_size=bdata.length,cdata=[];if(1==proto_flags)for(var i=0;i<actual_size;i++)cdata.push(bdata[i]);else for(var i=0;i<actual_size;i++)cdata.push(ord(bdata[i]));for(var header=["P".charCodeAt(0),proto_flags,0,0],i=3;i>=0;i--)header.push(payload_size>>8*i&255);header=header.concat(cdata),this.websocket&&this.websocket.send(new Uint8Array(header).buffer)}},XpraProtocol.prototype.process_message_queue=function(){for(;0!==this.mQ.length;){var packet=this.mQ.shift();if(!packet)return;var raw_draw_buffer="draw"===packet[0]&&"scroll"!==packet[6]&&packet[7].buffer;postMessage({c:"p",p:packet},raw_draw_buffer?[packet[7].buffer]:[])}},XpraProtocol.prototype.send=function(packet){this.sQ[this.sQ.length]=packet;var me=this;setTimeout(function(){me.process_send_queue()},this.process_interval)},XpraProtocol.prototype.set_packet_handler=function(callback,ctx){this.packet_handler=callback,this.packet_ctx=ctx},XpraProtocol.prototype.set_cipher_in=function(caps,key){this.cipher_in_block_size=32;var secret=forge.pkcs5.pbkdf2(key,caps["cipher.key_salt"],caps["cipher.key_stretch_iterations"],this.cipher_in_block_size);this.cipher_in=forge.cipher.createDecipher("AES-CBC",secret),this.cipher_in.start({iv:caps["cipher.iv"]})},XpraProtocol.prototype.set_cipher_out=function(caps,key){this.cipher_out_block_size=32;var secret=forge.pkcs5.pbkdf2(key,caps["cipher.key_salt"],caps["cipher.key_stretch_iterations"],this.cipher_out_block_size);this.cipher_out=forge.cipher.createCipher("AES-CBC",secret),this.cipher_out.start({iv:caps["cipher.iv"]})},"object"!=typeof window||"object"!=typeof document||window.document!==document){importScripts("lib/bencode.js","lib/zlib.js","lib/lz4.js","lib/es6-shim.js","lib/brotli_decode.js","lib/forge.js","lib/pyrencoder.js");var protocol=new XpraProtocol;protocol.is_worker=!0,protocol.set_packet_handler(function(packet,ctx){var raw_draw_buffer="draw"===packet[0]&&"scroll"!==packet[6];postMessage({c:"p",p:packet},raw_draw_buffer?[packet[7].buffer]:[])},null),self.addEventListener("message",function(e){var data=e.data;switch(data.c){case"o":protocol.open(data.u);break;case"s":protocol.send(data.p);break;case"x":protocol.set_cipher_out(data.p,data.k);break;case"z":protocol.set_cipher_in(data.p,data.k);break;case"c":protocol.close();break;case"t":self.close();break;default:postMessage({c:"l",t:"got unknown command from host"})}},!1),postMessage({c:"r"})}var Buffer=require("buffer").Buffer,LZ4=require("lz4");