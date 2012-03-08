// Classes

var Obj = {};
// object size calculator
Obj.size = function(obj){
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}
Obj.join = function(obj,separator){
	var str = '';
	for (var i in obj ) {
		str += obj[i]+separator
	};
	return str;
}
Obj.first = function(obj){
	for (var i in obj) {
		if (obj.hasOwnProperty(i) && typeof(i) !== 'function') {
			return i;
		}
	}
	return false;
}
// BeatBox Class
function BeatBox (piano) {
	this.piano = piano;	// sample instrument
	this.jsonBox = {}; // main box with boxes
	this.jsonFlat = {}; // series of notes with playtime
	var beatbox = this;
	
	this.play = function( ) {
		
		// assign the absolute play time of notes
		var startTime = beatbox.piano.sample.context.currentTime;

		for (var j in beatbox.jsonFlat ) {
			beatbox.piano.play(
				MX.Note.toBase(beatbox.jsonFlat[j].noteName),
				startTime+beatbox.jsonFlat[j].relativePlayTime
			);
		};
	};
	
	this.addBox = function( noteName /*D4*/ ,chordName /*maj7*/ ,pattern /*4*/ ) {

		// MX
		var chordNotes = MX.Chord.toNotes(noteName,chordName);
		chordNotes[3] = ( typeof( chordNotes[3] ) == 'undefined' ) ? chordNotes[1] : chordNotes[3];
		
		// Make Json
		var pattern = ( typeof( pattern ) == 'undefined' ) ? 1 : pattern;
		switch (pattern) {
			case 1 :
				beatbox.jsonBox[Obj.size(beatbox.jsonBox)] = {
					'1':{'noteName':chordNotes[0],'noteSize':1},
					'2':{'noteName':chordNotes[1],'noteSize':1},
					'3':{'noteName':chordNotes[2],'noteSize':1},
					'4':{'noteName':chordNotes[3],'noteSize':1}
				};
			break;
			default:
				beatbox.jsonBox[Obj.size(beatbox.jsonBox)] = {
					'1':{'noteName':chordNotes[0],'noteSize':1},
					'2':{'noteName':chordNotes[1],'noteSize':1},
					'3':{'noteName':chordNotes[2],'noteSize':1},
					'4':{'noteName':chordNotes[3],'noteSize':1}
				};
		}
		beatbox.resetJsonFlat();
		// Visual
	};
	
	this.resetJsonFlat = function(){
		
		// clear jsonFlat
		beatbox.jsonFlat = {};
		
		// create relative play time for each note
		var relativeBeat = 0;
		for (var i in beatbox.jsonBox ) {
			for (var j in beatbox.jsonBox[i] ) {
				var relativePlayTime = relativeBeat*eighthNoteTime;
				relativeBeat += beatbox.jsonBox[i][j].noteSize;
				beatbox.jsonFlat[Obj.size(beatbox.jsonFlat)] = {
					'noteName':beatbox.jsonBox[i][j].noteName,
					'relativePlayTime':relativePlayTime,
				};
			};
		};
	};

}

// Piano Class
function Piano () {
	
	// loop create piano sample url and name
	this.sample = new Sample();
	var piano = this;

	var loadParam = {};
	for (var base=9; base<=96 ; base++ ) {
		loadParam[base] = 'base/'+base+'.mp3';
	};
	
	// batch load piano sample
	this.load = function(callback){
		piano.sample.loadBatch(loadParam,false,callback);
	};
	// play single piano note
	this.play = function(name,noteTime){
		piano.sample.playNote(name, noteTime );
	};
}

// Sample Class
function Sample() {
	
	// Variables
	this.context = new webkitAudioContext();
	this.buffers = {};
	this.total = 0;
	this.count = 0;
	var sample = this;
	
	// Load Batch Count Total for callback
	this.loadBatch = function(loadParam,mixToMono,callback) {
		
		sample.total = Obj.size(loadParam);
		// loop batch audio url
		for ( var name in loadParam ) {
			sample.load(loadParam[name],name,mixToMono,callback);
		};
	}
	
	// load single Asynchornize 
	this.load = function(url,index,mixToMono,callback){
		
		// Ajax load
		var request = new XMLHttpRequest();
		request.open("GET", url , true );
		request.responseType = "arraybuffer";

		request.onload = function() {
			
			if (sample.context.decodeAudioData) {
				sample.context.decodeAudioData(
					request.response,function(buffer){
						sample.buffers[index] = buffer;
						if (++sample.count==sample.total) {
							callback();
						};
					}
				);
			} else {
				var buffer = sample.context.createBuffer(request.response, mixToMono);
				sample.buffers[index] = buffer;
				if (++sample.count==sample.total) {
					callback();
				};
			}
		}
		
		request.onerror = function () {
			alert('BufferLoader: XHR error');
		}
		request.send();
	}
	
	// play single note. no mix node
	this.playNote = function(name, noteTime){
		
		// Create the note
		var source = sample.context.createBufferSource();
		source.buffer = sample.buffers[name];
		
		var dryGainNode = sample.context.createGainNode();
		dryGainNode.gain.value = 1.0;
		
		// Create master volume.
		masterGainNode = sample.context.createGainNode();
		masterGainNode.gain.value = 0.8; // reduce overall volume to avoid clipping
		
		// Create effect volume.
		//effectLevelNode = sample.context.createGainNode();
		//effectLevelNode.gain.value = 1.0; // effect level slider controls this
		
		// Create convolver for effect
		//convolver = sample.context.createConvolver();

		
		// connect mix
		var finalMixNode = sample.context.destination;
		//if (sample.context.createDynamicsCompressor) {
		//	// Create a dynamics compressor to sweeten the overall mix.
		//	compressor = sample.context.createDynamicsCompressor();
		//	compressor.connect(sample.context.destination);
		//	finalMixNode = compressor;
		//}
		
		
		//convolver.connect(effectLevelNode);
		//effectLevelNode.connect(masterGainNode);
		
		source.connect(dryGainNode);
		dryGainNode.connect(masterGainNode);
		
		masterGainNode.connect(finalMixNode);
		
		source.noteOn(noteTime);
	}
	
}
