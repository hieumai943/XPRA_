!function(global,exports,perf){"use strict";function fixSetTarget(param){param&&(param.setTargetAtTime||(param.setTargetAtTime=param.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.hasOwnProperty("createPeriodicWave")||(AudioContext.prototype.createPeriodicWave=AudioContext.prototype.createWaveTable),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var node=this.internal_createGain();return fixSetTarget(node.gain),node},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(maxDelayTime){var node=maxDelayTime?this.internal_createDelay(maxDelayTime):this.internal_createDelay();return fixSetTarget(node.delayTime),node},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var node=this.internal_createBufferSource();return node.start?(node.internal_start=node.start,node.start=function(when,offset,duration){void 0!==duration?node.internal_start(when||0,offset,duration):node.internal_start(when||0,offset||0)}):node.start=function(when,offset,duration){offset||duration?this.noteGrainOn(when||0,offset,duration):this.noteOn(when||0)},node.stop?(node.internal_stop=node.stop,node.stop=function(when){node.internal_stop(when||0)}):node.stop=function(when){this.noteOff(when||0)},fixSetTarget(node.playbackRate),node},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var node=this.internal_createDynamicsCompressor();return fixSetTarget(node.threshold),fixSetTarget(node.knee),fixSetTarget(node.ratio),fixSetTarget(node.reduction),fixSetTarget(node.attack),fixSetTarget(node.release),node},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var node=this.internal_createBiquadFilter();return fixSetTarget(node.frequency),fixSetTarget(node.detune),fixSetTarget(node.Q),fixSetTarget(node.gain),node},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var node=this.internal_createOscillator();return node.start?(node.internal_start=node.start,node.start=function(when){node.internal_start(when||0)}):node.start=function(when){this.noteOn(when||0)},node.stop?(node.internal_stop=node.stop,node.stop=function(when){node.internal_stop(when||0)}):node.stop=function(when){this.noteOff(when||0)},node.setPeriodicWave||(node.setPeriodicWave=node.setWaveTable),fixSetTarget(node.frequency),fixSetTarget(node.detune),node})),window.hasOwnProperty("webkitOfflineAudioContext")&&!window.hasOwnProperty("OfflineAudioContext")&&(window.OfflineAudioContext=webkitOfflineAudioContext)}(window);