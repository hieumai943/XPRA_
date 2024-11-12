util={hashU32:function(a){return-1252372727^(a=(a=(a=(a=-949894596^(a=(a|=0)+2127912214+(a<<12)|0)^a>>>19)+374761393+(a<<5)|0)+-744332180^a<<9)+-42973499+(a<<3)|0)^a>>>16|0},readU64:function(b,n){var x=0;return x|=b[n++]<<0,x|=b[n++]<<8,x|=b[n++]<<16,x|=b[n++]<<24,x|=b[n++]<<32,x|=b[n++]<<40,x|=b[n++]<<48,x|=b[n++]<<56},readU32:function(b,n){var x=0;return x|=b[n++]<<0,x|=b[n++]<<8,x|=b[n++]<<16,x|=b[n++]<<24},writeU32:function(b,n,x){b[n++]=x>>0&255,b[n++]=x>>8&255,b[n++]=x>>16&255,b[n++]=x>>24&255},imul:function(a,b){var al=65535&a,bl=65535&b;return al*bl+((a>>>16)*bl+al*(b>>>16)<<16)|0}};var prime1=2654435761,prime2=2246822519,prime3=3266489917,prime4=668265263,prime5=374761393;function rotl32(x,r){return(x|=0)>>>(32-(r|=0)|0)|x<<r|0}function rotmul32(h,r,m){return h|=0,r|=0,m|=0,0|util.imul(h>>>(32-r|0)|h<<r,m)}function shiftxor32(h,s){return(h|=0)>>>(s|=0)^h|0}function xxhapply(h,src,m0,s,m1){return rotmul32(util.imul(src,m0)+h,s,m1)}function xxh1(h,src,index){return rotmul32(h+util.imul(src[index],prime5),11,prime1)}function xxh4(h,src,index){return xxhapply(h,util.readU32(src,index),prime3,17,prime4)}function xxh16(h,src,index){return[xxhapply(h[0],util.readU32(src,index+0),prime2,13,prime1),xxhapply(h[1],util.readU32(src,index+4),prime2,13,prime1),xxhapply(h[2],util.readU32(src,index+8),prime2,13,prime1),xxhapply(h[3],util.readU32(src,index+12),prime2,13,prime1)]}function xxh32(seed,src,index,len){var h,l;if(16<=(l=len)){for(h=[seed+prime1+prime2,seed+prime2,seed,seed-prime1];16<=len;)h=xxh16(h,src,index),index+=16,len-=16;h=rotl32(h[0],1)+rotl32(h[1],7)+rotl32(h[2],12)+rotl32(h[3],18)+l}else h=seed+prime5+len>>>0;for(;4<=len;)h=xxh4(h,src,index),index+=4,len-=4;for(;0<len;)h=xxh1(h,src,index),index++,len--;return(h=shiftxor32(util.imul(shiftxor32(util.imul(shiftxor32(h,15),prime2),13),prime3),16))>>>0}xxhash={},xxhash.hash=xxh32,lz4={};var minMatch=4,minLength=13,searchLimit=5,skipTrigger=6,hashSize=65536,mlBits=4,mlMask=(1<<mlBits)-1,runBits=4,runMask=(1<<runBits)-1,blockBuf=makeBuffer(5<<20),hashTable=makeHashTable(),magicNum=407708164,fdContentChksum=4,fdContentSize=8,fdBlockChksum=16,fdVersion=64,fdVersionMask=192,bsUncompressed=2147483648,bsDefault=7,bsShift=4,bsMask=7,bsMap={4:65536,5:262144,6:1048576,7:4194304};function makeHashTable(){try{return new Uint32Array(hashSize)}catch(error){for(var hashTable=new Array(hashSize),i=0;i<hashSize;i++)hashTable[i]=0;return hashTable}}function clearHashTable(table){for(var i=0;i<hashSize;i++)hashTable[i]=0}function makeBuffer(size){try{return new Uint8Array(size)}catch(error){for(var buf=new Array(size),i=0;i<size;i++)buf[i]=0;return buf}}function sliceArray(array,start,end){if(array.buffer,1,Uint8Array.prototype.slice)return array.slice(start,end);var len=array.length;start=(start|=0)<0?Math.max(len+start,0):Math.min(start,len),end=(end=void 0===end?len:0|end)<0?Math.max(len+end,0):Math.min(end,len);for(var arraySlice=new Uint8Array(end-start),i=start,n=0;i<end;)arraySlice[n++]=array[i++];return arraySlice}lz4.compressBound=function(n){return n+n/255+16|0},lz4.decompressBound=function(src){var sIndex=0;if(util.readU32(src,sIndex)!==magicNum)throw new Error("invalid magic number");sIndex+=4;var descriptor=src[sIndex++];if((descriptor&fdVersionMask)!==fdVersion)throw new Error("incompatible descriptor version "+(descriptor&fdVersionMask));var useBlockSum=0!=(descriptor&fdBlockChksum),useContentSize=0!=(descriptor&fdContentSize),bsIdx=src[sIndex++]>>bsShift&bsMask;if(void 0===bsMap[bsIdx])throw new Error("invalid block size "+bsIdx);var maxBlockSize=bsMap[bsIdx];if(useContentSize)return util.readU64(src,sIndex);sIndex++;for(var maxSize=0;;){var blockSize=util.readU32(src,sIndex);if(sIndex+=4,blockSize&bsUncompressed?maxSize+=blockSize&=~bsUncompressed:0<blockSize&&(maxSize+=maxBlockSize),0===blockSize)return maxSize;useBlockSum&&(sIndex+=4),sIndex+=blockSize}},lz4.makeBuffer=makeBuffer,lz4.decompressBlock=function(src,dst,sIndex,sLength,dIndex){var mLength,mOffset,sEnd,n,i,hasCopyWithin=void 0!==dst.copyWithin&&void 0!==dst.fill;for(sEnd=sIndex+sLength;sIndex<sEnd;){var token=src[sIndex++],literalCount=token>>4;if(0<literalCount){if(15===literalCount)for(;literalCount+=src[sIndex],255===src[sIndex++];);for(n=sIndex+literalCount;sIndex<n;)dst[dIndex++]=src[sIndex++]}if(sEnd<=sIndex)break;if(mLength=15&token,mOffset=src[sIndex++]|src[sIndex++]<<8,15===mLength)for(;mLength+=src[sIndex],255===src[sIndex++];);if(mLength+=minMatch,hasCopyWithin&&1==mOffset)dst.fill(0|dst[dIndex-1],dIndex,dIndex+mLength),dIndex+=mLength;else if(hasCopyWithin&&mLength<mOffset&&31<mLength)dst.copyWithin(dIndex,dIndex-mOffset,dIndex-mOffset+mLength),dIndex+=mLength;else for(n=(i=dIndex-mOffset)+mLength;i<n;)dst[dIndex++]=0|dst[i++]}return dIndex},lz4.compressBlock=function(src,dst,sIndex,sLength,hashTable){var mIndex,mAnchor,mLength,mOffset,literalCount,dIndex,sEnd,n;if(dIndex=0,sEnd=sLength+sIndex,mAnchor=sIndex,minLength<=sLength)for(var searchMatchCount=3+(1<<skipTrigger);sIndex+minMatch<sEnd-searchLimit;){var seq=util.readU32(src,sIndex),hash=util.hashU32(seq)>>>0;if(mIndex=hashTable[hash=(hash>>16^hash)>>>0&65535]-1,hashTable[hash]=sIndex+1,mIndex<0||0<sIndex-mIndex>>>16||util.readU32(src,mIndex)!==seq)sIndex+=searchMatchCount++>>skipTrigger;else{for(searchMatchCount=3+(1<<skipTrigger),literalCount=sIndex-mAnchor,mOffset=sIndex-mIndex,mIndex+=minMatch,mLength=sIndex+=minMatch;sIndex<sEnd-searchLimit&&src[sIndex]===src[mIndex];)sIndex++,mIndex++;var token=(mLength=sIndex-mLength)<mlMask?mLength:mlMask;if(runMask<=literalCount){for(dst[dIndex++]=(runMask<<mlBits)+token,n=literalCount-runMask;255<=n;n-=255)dst[dIndex++]=255;dst[dIndex++]=n}else dst[dIndex++]=(literalCount<<mlBits)+token;for(var i=0;i<literalCount;i++)dst[dIndex++]=src[mAnchor+i];if(dst[dIndex++]=mOffset,dst[dIndex++]=mOffset>>8,mlMask<=mLength){for(n=mLength-mlMask;255<=n;n-=255)dst[dIndex++]=255;dst[dIndex++]=n}mAnchor=sIndex}}if(0===mAnchor)return 0;if(runMask<=(literalCount=sEnd-mAnchor)){for(dst[dIndex++]=runMask<<mlBits,n=literalCount-runMask;255<=n;n-=255)dst[dIndex++]=255;dst[dIndex++]=n}else dst[dIndex++]=literalCount<<mlBits;for(sIndex=mAnchor;sIndex<sEnd;)dst[dIndex++]=src[sIndex++];return dIndex},lz4.decompressFrame=function(src,dst){var useBlockSum,useContentSum,useContentSize,descriptor,sIndex=0,dIndex=0;if(util.readU32(src,sIndex)!==magicNum)throw new Error("invalid magic number");if(sIndex+=4,((descriptor=src[sIndex++])&fdVersionMask)!==fdVersion)throw new Error("incompatible descriptor version");useBlockSum=0!=(descriptor&fdBlockChksum),useContentSum=0!=(descriptor&fdContentChksum),useContentSize=0!=(descriptor&fdContentSize);var bsIdx=src[sIndex++]>>bsShift&bsMask;if(void 0===bsMap[bsIdx])throw new Error("invalid block size");for(useContentSize&&(sIndex+=8),sIndex++;;){var compSize;if(compSize=util.readU32(src,sIndex),sIndex+=4,0===compSize)break;if(useBlockSum&&(sIndex+=4),0!=(compSize&bsUncompressed)){compSize&=~bsUncompressed;for(var j=0;j<compSize;j++)dst[dIndex++]=src[sIndex++]}else dIndex=lz4.decompressBlock(src,dst,sIndex,compSize,dIndex),sIndex+=compSize}return useContentSum&&(sIndex+=4),dIndex},lz4.compressFrame=function(src,dst){var dIndex=0;util.writeU32(dst,dIndex,magicNum),dIndex+=4,dst[dIndex++]=fdVersion,dst[dIndex++]=bsDefault<<bsShift,dst[dIndex]=xxhash.hash(0,dst,4,dIndex-4)>>8,dIndex++;var maxBlockSize=bsMap[bsDefault],remaining=src.length,sIndex=0;for(clearHashTable(hashTable);0<remaining;){var compSize,blockSize=maxBlockSize<remaining?maxBlockSize:remaining;if(blockSize<(compSize=lz4.compressBlock(src,blockBuf,sIndex,blockSize,hashTable))||0===compSize){util.writeU32(dst,dIndex,2147483648|blockSize),dIndex+=4;for(var z=sIndex+blockSize;sIndex<z;)dst[dIndex++]=src[sIndex++];remaining-=blockSize}else{util.writeU32(dst,dIndex,compSize),dIndex+=4;for(var j=0;j<compSize;)dst[dIndex++]=blockBuf[j++];sIndex+=blockSize,remaining-=blockSize}}return util.writeU32(dst,dIndex,0),dIndex+=4},lz4.decompress=function(src,maxSize){var dst,size;return void 0===maxSize&&(maxSize=lz4.decompressBound(src)),dst=lz4.makeBuffer(maxSize),(size=lz4.decompressFrame(src,dst))!==maxSize&&(dst=sliceArray(dst,0,size)),dst},lz4.compress=function(src,maxSize){var dst,size;return void 0===maxSize&&(maxSize=lz4.compressBound(src.length)),dst=lz4.makeBuffer(maxSize),(size=lz4.compressFrame(src,dst))!==maxSize&&(dst=sliceArray(dst,0,size)),dst},lz4.decode=function(data){var length=data[0]|data[1]<<8|data[2]<<16|data[3]<<24;if(length<=0)throw"invalid length: "+length;if(1073741824<length)throw"length too long: "+length;var inflated=new Uint8Array(length);return lz4.decompressBlock(data,inflated,4,length,0),inflated};