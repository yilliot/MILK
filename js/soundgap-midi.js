// audio context declare
try {
	//var audio_context = new webkitAudioContext();
} catch(e) {
	throw('Web Audio API is not supported in this browser');
}

var play_controller = {
	'track'       : {},
	'slot'        : {},
	'bars'        : {},
	'slot_seq'    : [],
	'start_time'  : 0,
	'status'      : 0, // play, stop
	'loop'        : true,
	'loop_times'  : 1,
	'init'        : function(song,callback){
		// create track
		for ( var i in song.axis.track ) {
			// push array to this.track
			this.track[i] = new track();
			this.track[i].load_config(song.axis.track[i]);
			this.track[i].init(callback);
		}
		// create slot
		for ( i in song.axis.slot ) {
			this.slot[i] = new slot();
			this.slot[i].load_config(song.axis.slot[i]);
			this.slot[i].init();
		}
		for ( i in song.content ) {
			this.bars[i] = [];
			for ( var j in song.content[i] ) {
				var slot_n = i.split('.')[1];
				this.bars[i][j] = new note ();
				this.bars[i][j].load_config(song.content[i][j]);
				this.bars[i][j].init(this.slot[slot_n].app_setup.tempo);
			}
		}
	},
	'stop': function(){
		for (var i in this.track ) {
			this.track[i].stop_notes();
		}
	},
	'play': function(play_time){
		// init
		this.start_time = (typeof(play_time)=='undefined')?sample_loader.audio_context.currentTime:play_time;
		
		// reset slot play_count
		for (var i in this.slot ) {
			this.slot[i].app_setup.play_count = 0;
		}

		// flatten slots by direction
		var slot_number = 0;
		var tmp_slot = this.slot[slot_number];
		var slot_seq = [];
		var song_total_time = 0;

		while ( slot_number != -1 ){
			slot_seq.push( slot_number );
			song_total_time += tmp_slot.app_setup.tempo * tmp_slot.config.nn;
			slot_number = tmp_slot.app_setup.direction[tmp_slot.app_setup.play_count];
			tmp_slot.app_setup.play_count++;
			tmp_slot = this.slot[slot_number];
		}

		// set trigger to call this function
		if (this.loop && this.loop_times*this) {
			//this.play_loop(this.start_time * loop_times);
		}

		// play flatten slots
		var bar_start_time = this.start_time;
		for ( i in slot_seq ) {
			bar_start_time += this.slot[slot_seq[i]].app_setup.tempo*this.slot[slot_seq[i]].config.nn;
			this.play_bar( slot_seq[i] , bar_start_time );
		}
	},
	'play_bar' : function ( bar_n , bar_start_time ) {
		for (var i in this.track ) {
			var notes = this.bars[i+'.'+bar_n];
			for (var j in notes ) {
				this.track[i].play_note(
					bar_start_time,
					notes[j]
				);
			}
		}
	},
	'play_loop' : function(play_time){

	}
};

// notes inside bar, instant created by play_controller
function note() {
	this.config = {
		'notename' : 'C+04',
		'start'    : 0,  // 96 PPQN
		'length'   : 96, // 96 PPQN
		'velocity' : 127
	};
	this.app_setup = {
		'base'     : 20,
		'start'    : '', // time in bar
		'fall'     : '', // time in bar
		'stop'     : '', // time in bar
		'length'   : '', // time
		'volume'   : 1
	};
	this.load_config = function ( data ) {
		this.config = data;
	};
	this.init = function( tempo ) {
		var fall = tempo*0.23;
		this.app_setup.start  = tempo * this.config.start / 96;

		this.app_setup.fall   = tempo * this.config.length / 96 + this.app_setup.start - fall;
		this.app_setup.stop   = tempo * this.config.length / 96 + this.app_setup.start + fall;
		this.app_setup.length = tempo * this.config.length / 96;

		this.app_setup.base   = MX.Note.toBase(this.config.notename);
		this.app_setup.volume = this.config.velocity/127;
	};
}


// horizontal slot for bar placement
function slot() {
	this.config = { // user setup for storage
		'bpm'       : 120,
		'nn'        : 4, // numerator
		'dd'        : 4, // denominator
		'sf'        : 0, // 0:C
		'mi'        : 0, // 0:Major
		'direction' : {
			'1':'2'
		}
	};
	this.app_setup = { // load system setup for track
		'tempo'      : 0.5, // 120bpm
		'play_count' : 0,
		'direction'  : {
			'1':'2'
		}
	};
	this.load_config = function(data) {
		this.config = data;
	};
	this.init = function(){ // call after config, do app_setup
		// convert bpm to tempo
		this.app_setup.tempo = ( 60 / this.config.bpm );
		this.app_setup.direction = this.config.direction;
	};
}

function track(){
	this.config      = { // user setup for storage
		'instrument'  :'piano',
		'volume'      :0.8 // reduce overall volume to avoid clipping
	};
	this.app_setup   = {
		'instrument_buffers' :{},
		'masterGainNode'     :{},
		'sources'            :{}
	};
	this.init = function(callback){ // call after config, do app_setup
		sample_loader.load(this.config.instrument,this.app_setup.instrument_buffers,callback);

		// Create master volume for track.
		this.app_setup.masterGainNode = sample_loader.audio_context.createGainNode();
		this.app_setup.masterGainNode.gain.value = this.config.volume;
		this.app_setup.sources = [];
	};
	this.load_config = function(data) {
		this.config.instrument = data.instrument;
		if (typeof data.volume == 'undefined') {
			this.volume = data.volume;
		}
	};
	this.play_note = function( start_time , note ){

		// Create the note
		var source = sample_loader.audio_context.createBufferSource();
		source.buffer = this.app_setup.instrument_buffers[note.app_setup.base];
		
		var dryGainNode = sample_loader.audio_context.createGainNode();
		dryGainNode.gain.value = note.app_setup.volume;
				
		source.connect(dryGainNode);
		dryGainNode.connect(this.app_setup.masterGainNode);
		this.app_setup.masterGainNode.connect(sample_loader.audio_context.destination);

		source.noteOn(start_time+note.app_setup.start);
		
		// fade-out and noteOff
		if (typeof note.app_setup.stop != 'undefined' && note.app_setup.stop !== null) {

			// fade out before noteOff
			dryGainNode.gain.setValueAtTime(
				this.app_setup.masterGainNode.gain.value,
				start_time+note.app_setup.fall
			);
			dryGainNode.gain.linearRampToValueAtTime(
				0,
				start_time+note.app_setup.stop
			);
			source.noteOff(start_time+note.app_setup.stop+1);
		}

		// store for stop
		this.app_setup.sources.push(source);
	};
	this.stop_notes = function(){
		for (var i in this.app_setup.sources ) {
			this.app_setup.sources[i].noteOff(0);
		}
		this.app_setup.sources = [];
	};
}

// load audio samples from cdn via xmlhttprequest and put in buffers
// parameter : instrument, buffers for return, callback
var sample_loader = {

	'audio_context' : new webkitAudioContext(),
	'count' : 0,
	'total' : 0,

	'load' : function(instrument,buffers,callback){
		// def
		this.count             = 0;
		this.total             = 0;
		this.instrument_buffer = [];
		if (this.sample[instrument].type=='range') {
			this.total = this.sample[instrument].data[1] - this.sample[instrument].data[0];
			var range = Obj.range(this.sample[instrument].data[0],this.sample[instrument].data[1]);
			this.instrument_buffer = this.sample[instrument];
			this.instrument_buffer.data = {};
			for (var r in range ) {
				this.instrument_buffer.data[range[r]] = {'display':range[r],'filename':range[r]+'.mp3'};
			}
		} else if(this.sample[instrument].type=='track') {
			this.total = this.sample[instrument].length;
			this.instrument_buffer = this.sample[instrument_buffer];
		}
		for (var i in this.instrument_buffer.data ) {
			this._load(
				i,
				this.cdn_url+this.instrument_buffer.path +'/'+ this.instrument_buffer.data[i].filename,
				buffers,
				callback
			);
		}
	},

	'_load' : function(index,url,buffers,callback){
		var request = new XMLHttpRequest();
		$this = this;
		request.open("GET", url , true );
		request.responseType = "arraybuffer";
		request.onload = function() {
			sample_loader.audio_context.decodeAudioData(request.response,function(buffer){
				buffers[index] = buffer;
				if (++$this.count==$this.total) {
					callback();
				}
			});
		};
		request.onerror = function () {
			throw 'Loader: BufferLoader: XHR error';
		};
		request.send();
	},

	'cdn_url'  : 'http://milk.localhost/samples/',
	'sample' : {
		'piano' : {
			'path' : 'base',
			'type' : 'range',
			'data' : [9,97]
		},
		'guitar' : {
			'path' : 'guitar',
			'type' : 'range',
			'data' : [12,73]
		},
		'bass' : {
			'path' : 'bass',
			'type' : 'range',
			'data' : [20,73]
		},
		'string' : {
			'path' : 'string',
			'type' : 'range',
			'data' : [12,85]
		},
		'chord':{
			'type' : 'track',
			'path' : 'chord_piece',
			'data' : {
				'I7'    :{'display':'I 7',		'filename':'CP-I7.mp3'},
				'ii7'   :{'display':'ii 7',		'filename':'CP-ii7.mp3'},
				'I'     :{'display':'I',		'filename':'CP-Imaj.mp3'},
				'Imaj7' :{'display':'I Maj7',	'filename':'CP-Imaj7.mp3'},
				'i'     :{'display':'i',		'filename':'CP-Imin.mp3'},
				'i7'    :{'display':'i 7',		'filename':'CP-Imin7.mp3'},
				'IV7'   :{'display':'IV 7',		'filename':'CP-IV7.mp3'},
				'IV'    :{'display':'IV',		'filename':'CP-IVmaj.mp3'},
				'iv7'   :{'display':'iv 7',		'filename':'CP-IVmin7.mp3'},
				'V7'    :{'display':'V 7',		'filename':'CP-V7.mp3'},
				'vi'    :{'display':'vi',		'filename':'CP-vi.mp3'},
				'vi7'   :{'display':'vi 7',		'filename':'CP-vi7.mp3'},
				'V'     :{'display':'V',		'filename':'CP-Vmaj.mp3'},
				'v7'    :{'display':'v 7',		'filename':'CP-Vmin7.mp3'}
			}
		}
	}
};


// handy object manipulate, investigate and generation collection tools
var Obj = {
	'size' : function(obj){
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},
	'join' : function(obj,separator){
		var str = '';
		for (var i in obj ) {
			str += obj[i]+separator;
		}
		return str;
	},
	'first' : function(obj){
		for (var i in obj) {
			if (obj.hasOwnProperty(i) && typeof(i) !== 'function') {
				return i;
			}
		}
		return false;
	},
	'range' : function(start,end,step){
		var l = arguments.length;
		if(l === 0) return [];
		if(l == 1) return arguments.callee(0, start, 1);
		if(l == 2) return arguments.callee(start, end, 1);
		var temp = [];
		start = start>>0, end = end>>0, step = step>>0;
		for(;start < end; start+= step){
			temp.push(start);
		}
		return temp;
	}
};

var midi_constant = {
	'PPQN':{
		'384' : 'Whole',
		'192' : 'Half',
		'96'  : 'Quarter',
		'48'  : 'Eighth',
		'24'  : '16th',
		'12'  : '32nd',
		'6'   : '64th',
		'3'   : '128th',
		'576' : 'Dotted Whole',
		'288' : 'Dotted Half',
		'144' : 'Dotted Quarter',
		'72'  : 'Dotted Eighth',
		'36'  : 'Dotted 16th',
		'18'  : 'Dotted 32nd',
		'9'   : 'Dotted 64th',
		'256' : 'Whole Triplet',
		'128' : 'Half  Triplet',
		'64'  : 'Quarter Triplet',
		'32'  : 'Eighth Triplet',
		'16'  : '16th Triplet',
		'8'   : '32nd Triplet',
		'4'   : '64th Triplet',
		'2'   : '128th Triplet'
	},
	'sf':{
		'-7':'Cb',
		'-6':'Gb',
		'-5':'Db',
		'-4':'Ab',
		'-3':'Eb',
		'-2':'Bb',
		'-1':'F',
		'0' :'C',
		'1' :'G',
		'2' :'D',
		'3' :'A',
		'4' :'E',
		'5' :'B',
		'6' :'F#',
		'7' :'C#'
	},
	'mi':{
		'0':'Major',
		'1':'Minor'
	},
	'track_instrument' : { //Piano:
		'1' : 'Acoustic Grand Piano',
		'2' : 'Bright Acoustic Piano',
		'3' : 'Electric Grand Piano',
		'4' : 'Honky-tonk Piano',
		'5' : 'Electric Piano 1',
		'6' : 'Electric Piano 2',
		'7' : 'Harpsichord',
		'8' : 'Clavinet',

		//Chromatic Percussion:
		'9'  : 'Celesta',
		'10' : 'Glockenspiel',
		'11' : 'Music Box',
		'12' : 'Vibraphone',
		'13' : 'Marimba',
		'14' : 'Xylophone',
		'15' : 'Tubular Bells',
		'16' : 'Dulcimer',

		//Organ:
		'17' : 'Drawbar Organ',
		'18' : 'Percussive Organ',
		'19' : 'Rock Organ',
		'20' : 'Church Organ',
		'21' : 'Reed Organ',
		'22' : 'Accordion',
		'23' : 'Harmonica',
		'24' : 'Tango Accordion',

		//Guitar:
		'25' : 'Acoustic Guitar (nylon)',
		'26' : 'Acoustic Guitar (steel)',
		'27' : 'Electric Guitar (jazz)',
		'28' : 'Electric Guitar (clean)',
		'29' : 'Electric Guitar (muted)',
		'30' : 'Overdriven Guitar',
		'31' : 'Distortion Guitar',
		'32' : 'Guitar harmonics',

		//Bass:
		'33' : 'Acoustic Bass',
		'34' : 'Electric Bass (finger)',
		'35' : 'Electric Bass (pick)',
		'36' : 'Fretless Bass',
		'37' : 'Slap Bass 1',
		'38' : 'Slap Bass 2',
		'39' : 'Synth Bass 1',
		'40' : 'Synth Bass 2',

		//Strings:
		'41' : 'Violin',
		'42' : 'Viola',
		'43' : 'Cello',
		'44' : 'Contrabass',
		'45' : 'Tremolo Strings',
		'46' : 'Pizzicato Strings',
		'47' : 'Orchestral Harp',
		'48' : 'Timpani',

		//Strings (continued):
		'49' : 'String Ensemble 1',
		'50' : 'String Ensemble 2',
		'51' : 'Synth Strings 1',
		'52' : 'Synth Strings 2',
		'53' : 'Choir Aahs',
		'54' : 'Voice Oohs',
		'55' : 'Synth Voice',
		'56' : 'Orchestra Hit',

		//Brass:
		'57' : 'Trumpet',
		'58' : 'Trombone',
		'59' : 'Tuba',
		'60' : 'Muted Trumpet',
		'61' : 'French Horn',
		'62' : 'Brass Section',
		'63' : 'Synth Brass 1',
		'64' : 'Synth Brass 2',

		//Reed:
		'65' : 'Soprano Sax',
		'66' : 'Alto Sax',
		'67' : 'Tenor Sax',
		'68' : 'Baritone Sax',
		'69' : 'Oboe',
		'70' : 'English Horn',
		'71' : 'Bassoon',
		'72' : 'Clarinet',

		//Pipe:
		'73' : 'Piccolo',
		'74' : 'Flute',
		'75' : 'Recorder',
		'76' : 'Pan Flute',
		'77' : 'Blown Bottle',
		'78' : 'Shakuhachi',
		'79' : 'Whistle',
		'80' : 'Ocarina',

		//Synth Lead:
		'81' : 'Lead 1 (square)',
		'82' : 'Lead 2 (sawtooth)',
		'83' : 'Lead 3 (calliope)',
		'84' : 'Lead 4 (chiff)',
		'85' : 'Lead 5 (charang)',
		'86' : 'Lead 6 (voice)',
		'87' : 'Lead 7 (fifths)',
		'88' : 'Lead 8 (bass + lead)',

		//Synth Pad:
		'89' : 'Pad 1 (new age)',
		'90' : 'Pad 2 (warm)',
		'91' : 'Pad 3 (polysynth)',
		'92' : 'Pad 4 (choir)',
		'93' : 'Pad 5 (bowed)',
		'94' : 'Pad 6 (metallic)',
		'95' : 'Pad 7 (halo)',
		'96' : 'Pad 8 (sweep)',

		//Synth Effects:
		'97'  : 'FX 1 (rain)',
		'98'  : 'FX 2 (soundtrack)',
		'99'  : 'FX 3 (crystal)',
		'100' : 'FX 4 (atmosphere)',
		'101' : 'FX 5 (brightness)',
		'102' : 'FX 6 (goblins)',
		'103' : 'FX 7 (echoes)',
		'104' : 'FX 8 (sci-fi)',

		//Ethnic:
		'105' : 'Sitar',
		'106' : 'Banjo',
		'107' : 'Shamisen',
		'108' : 'Koto',
		'109' : 'Kalimba',
		'110' : 'Bag pipe',
		'111' : 'Fiddle',
		'112' : 'Shanai',

		//Percussive:
		'113' : 'Tinkle Bell',
		'114' : 'Agogo',
		'115' : 'Steel Drums',
		'116' : 'Woodblock',
		'117' : 'Taiko Drum',
		'118' : 'Melodic Tom',
		'119' : 'Synth Drum',

		//Sound effects:
		'120' : 'Reverse Cymbal',
		'121' : 'Guitar Fret Noise',
		'122' : 'Breath Noise',
		'123' : 'Seashore',
		'124' : 'Bird Tweet',
		'125' : 'Telephone Ring',
		'126' : 'Helicopter',
		'127' : 'Applause',
		'128' : 'Gunshot'
	}

};