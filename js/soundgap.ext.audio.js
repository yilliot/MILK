// soundgap audio library
var SoundGap = (function( SoundGap , $ , undefined ){

	SoundGap.audio_context = new webkitAudioContext();

	SoundGap.generator = {

		'setting' : {
			'bpm'       : 120,
			'nn'        : 4, // numerator
			'dd'        : 4, // denominator
			'sf'        : 0, // 0:C
			'mi'        : 0 // 0:Major
		},
		'_type_rest' : function () {
			return [];
		},
		'_type_chord_1' : function(){
			var notes = new SoundGap.note();
			
			return [];
		},
		'_type_root_chord' : function(){

		},
		'_type_chord_134' : function(){

		},
		'_type_arpegios_8' : function(){

		},
		'_type_arpegios_332' : function(){

		},
		'_type_arpegios_333322' : function(){

		}
	};

	SoundGap.controller = function(){

		this.instrumentLoaded = {};
		this.is_play   = false;
		this.is_loop   = false;
		this.loaded_slot_id = 0;
		this.realtime_slot_id = 0;
		this.tracks = [];

		// delete
		this.delete_track = function(track_id) {
			this.tracks[track_id] = undefined;
		},
		this.delete_slot = function(track_id,slot_id) {
			this.tracks[track_id].slots[slot_id] = undefined;
		},

		// update
		this.update_track = function(track_id,instrument,volume,callback){
			this.tracks[track_id].track.config.instrument = instrument;
			this.tracks[track_id].track.config.volume = volume;
			this.tracks[track_id].track.init(function(){
				callback(track_id);
			});
			return track_id;
		},
		this.create_slot = function(track_id,slot_id,bpm,nn,dd){
			this.tracks[track_id].slots[slot_id].slot.config.bpm = bpm;
			this.tracks[track_id].slots[slot_id].slot.config.nn = nn;
			this.tracks[track_id].slots[slot_id].slot.config.dd = dd;
			this.tracks[track_id].slots[slot_id].slot.init(slot_id);
			return slot_id;
		},

		// create track
		this.create_track = function(instrument,volume,callback){
			var track_id = this.tracks.length;
			var track = new SoundGap.track();
			track.config.instrument = instrument;
			track.config.volume = volume;
			track.init(function(){
				callback(track_id);
			});
			this.tracks[track_id] = {'track':track,'slots':[]};
			return track_id;
		};
		this.create_slot = function(track_id,bpm,nn,dd){
			var slot_id = this.tracks[track_id].slots.length;
			var slot = new SoundGap.slot();
			slot.config.bpm = bpm;
			slot.config.nn = nn;
			slot.config.dd = dd;
			slot.init(slot_id);
			this.tracks[track_id].slots[slot_id] = {'slot':slot,'bar':[]};
			return slot_id;
		};
		this.create_note = function(track_id,slot_id,note){
			var bar = this.tracks[track_id].slots[slot_id].bar;
			bar[bar.length] = note;
		};

		this.play = function(){
			if (this.is_play===false) {
				this.is_play = true;
				this.timecheck();
			}
		};
		this.pause = function(){
			this.is_play = false;
			// note is slot shall stop
		};

		this.timecheck = function(){
			if (this.is_play) {
				// update realtime_slot_id
				if (this.loaded_slot_id==this.realtime_slot_id) {
					// find next slot
					var loaded_slot_id = 1;
					this.loaded_slot_id = loaded_slot_id;
				}
				with (this) {
					setTimeout( function() { timecheck(); }, 100 );
				}
			}
		};

	};

	// notes inside bar, instant created by controller
	SoundGap.note = function() {
		this.config = {
			'notename' : '20',
			'start'    : 0,  // 96 PPQN
			'length'   : 96, // 96 PPQN
			'velocity' : 127
		};
		this.app_setup = {
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

			this.app_setup.volume = this.config.velocity/127;
		};
	};

	// slot for bar placement
	SoundGap.slot = function() {
		this.config = { // user setup for storage
			'bpm'       : 120,
			'nn'        : 4, // numerator
			'dd'        : 4, // denominator
			'sf'        : 0, // 0:C
			'mi'        : 0 // 0:Major
		};
		this.app_setup = { // load system setup for track
			'id'         : 0, // unique [in track] for navigation
			'tempo'      : 0.5, // 120bpm
			'play_count' : 0,
			'direction'  : {} // {'1':'2'} if key not found default next
		};
		this.load_config = function(data) {
			this.config = data;
		};
		this.init = function(id){ // call after config, do app_setup
			// convert bpm to tempo
			this.app_setup.id        = id;
			this.app_setup.tempo     = ( 60 / this.config.bpm );
			this.app_setup.direction = {}; // default next
		};
	};

	// require loader
	// instrument track for bar placement
	SoundGap.track = function(){
		this.count = 0;
		this.config      = { // user setup for storage
			'instrument'  : 'piano',
			'volume'      : 0.8 // reduce overall volume to avoid clipping
		};
		this.app_setup   = {
			'instrument_buffers' :{},
			'masterGainNode'     :{},
			'sources'            :{}
		};
		this.init = function(callback){ // call after config, do app_setup

			var loader = new SoundGap.loader();
			loader.load(this.config.instrument,this.app_setup.instrument_buffers,callback);

			// Create master volume for track.
			this.app_setup.masterGainNode = SoundGap.audio_context.createGainNode();
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
			var source = SoundGap.audio_context.createBufferSource();
			source.buffer = this.app_setup.instrument_buffers[note.config.notename];
			
			var dryGainNode = SoundGap.audio_context.createGainNode();
			dryGainNode.gain.value = note.app_setup.volume;
					
			source.connect(dryGainNode);
			dryGainNode.connect(this.app_setup.masterGainNode);
			this.app_setup.masterGainNode.connect(SoundGap.audio_context.destination);

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
	};

	// load audio samples from cdn via xmlhttprequest and put in buffers
	// parameter : instrument, buffers for return, callback
	SoundGap.loader = function(){
		this.count = 0;
		this.total = 0;

		this.load = function(instrument,buffers,callback){
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
				this.total = Obj.size(this.sample[instrument].data);
				this.instrument_buffer = this.sample[instrument];
			}
			for (var i in this.instrument_buffer.data ) {
				this._AjaxCall(
					i,
					this.instrument_buffer.path +'/'+ this.instrument_buffer.data[i].filename,
					buffers,
					callback
				);
			}
		};
		var $this = this;
		this._AjaxCall = function(index,url,buffers,callback){
			var request = new XMLHttpRequest();
			request.open("GET", this.cdn_url+url , true );
			request.responseType = "arraybuffer";
			request.onload = function() {
				SoundGap.audio_context.decodeAudioData(request.response,function(buffer){
					buffers[index] = buffer;
					console.log( $this.count );
					if (++$this.count==$this.total) {
						callback();
					}
				});
			};
			request.onerror = function () {
				throw 'Loader: BufferLoader: XHR error';
			};
			request.send();
		};
		// play single piano note
		this.play = function(name,noteTime){
			SoundGap.audio_context.playNote(name, noteTime , null );
		};
		this.cdn_url  = 'http://milk.localhost/samples/';
		this.sample = {
			'piano' : {
				'path' : 'piano',
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
			'synth'  : {
				'path' : 'synth',
				'type' : 'range',
				'data' : [9,96]
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
		};
	};

	return SoundGap;
}(window.SoundGap=window.SoundGap||{},jQuery));


try {
	var audio_context = new webkitAudioContext();
} catch(e) {
	throw('Web Audio API is not supported in this browser');
}
