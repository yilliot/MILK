
		function try_group_last_answer(){
			var terminal_last_group = terminal_value.split(';')[terminal_value.split(';').length-1];
			var codes = [];

			for (var code in code_display_pair ) {
				codes.push(code);
			}

			if ( $.inArray(terminal_last_group,codes) != -1 ){
				terminal_value += ';';
				return true;
			}
			return false;

		}

		function update_terminal_display (){

			var terminal_group = terminal_value.split(';');
			var terminal_html = '';
			var codes = [];

			for (var code in code_display_pair ) {
				codes.push(code);
			}

			for (var i in terminal_group ) {
				var terminal_subhtml = '';
				if(
					i != (terminal_group.length-1) &&
					$.inArray(terminal_group[i],codes) != -1
				) {
					var terminal_subhtml = '<span class="btn btn-mini">'+code_display_pair[terminal_group[i]]+'</span>';
				} else {
					var terminal_subhtml = terminal_group[i].replace(/\s/g, '&nbsp;');
				}
				terminal_html += terminal_subhtml;
			}
			$('span#console-input').html(terminal_html);
		}



		///////////////////
		///////////////////
		///////////////////


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
				}
			};
			
			this.addBox = function( noteName /*D4*/ ,chordName /*maj7*/ ,pattern /*4*/ ) {

				// MX
				var chordNotes = MX.Chord.toNotes(noteName,chordName);
				chordNotes[3] = ( typeof( chordNotes[3] ) == 'undefined' ) ? chordNotes[1] : chordNotes[3];
				
				// Make Json
				pattern = ( typeof( pattern ) == 'undefined' ) ? 1 : pattern;
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
							'relativePlayTime':relativePlayTime
						};
					}
				}
			};

		}

		// Piano Class
		function HarmonizeChord () {
			
			// loop create piano sample url and name
			this.sample = new Sample();
			var piano = this;
			var cdnurl_cp = 'http://milk.localhost/samples/';
			var loadParam = {
				'I7'    :cdnurl_cp+'chord_piece/CP-I7.mp3',
				'ii7'   :cdnurl_cp+'chord_piece/CP-ii7.mp3',
				'Imaj'  :cdnurl_cp+'chord_piece/CP-Imaj.mp3',
				'Imaj7' :cdnurl_cp+'chord_piece/CP-Imaj7.mp3',
				'Imin'  :cdnurl_cp+'chord_piece/CP-Imin.mp3',
				'Imin7' :cdnurl_cp+'chord_piece/CP-Imin7.mp3',
				'IV7'   :cdnurl_cp+'chord_piece/CP-IV7.mp3',
				'IVmaj' :cdnurl_cp+'chord_piece/CP-IVmaj.mp3',
				'IVmin7':cdnurl_cp+'chord_piece/CP-IVmin7.mp3',
				'V7'    :cdnurl_cp+'chord_piece/CP-V7.mp3',
				'vi'    :cdnurl_cp+'chord_piece/CP-vi.mp3',
				'vi7'   :cdnurl_cp+'chord_piece/CP-vi7.mp3',
				'Vmaj'  :cdnurl_cp+'chord_piece/CP-Vmaj.mp3',
				'Vmin7' :cdnurl_cp+'chord_piece/CP-Vmin7.mp3'
			};
		//	for (var base=9; base<=96 ; base++ ) {
		//		loadParam[base] = 'base/'+base+'.mp3';
		//	}
			
			// batch load piano sample
			this.load = function(callback){
				piano.sample.loadBatch(loadParam,false,callback);
			};
			// play single piano note
			this.play = function(name,noteTime){
				piano.sample.playNote(name, noteTime , null );
			};
		}


		// Piano Class
		function Piano () {
			
			// loop create piano sample url and name
			this.sample = new Sample();
			var piano = this;

			var loadParam = {};
			var cdnurl_base = 'http://milk.localhost/samples/';
			for (var base=9; base<=96 ; base++ ) {
				loadParam[base] = cdnurl_base+'base/'+base+'.mp3';
			}
			
			// batch load piano sample
			this.load = function(callback){
				piano.sample.loadBatch(loadParam,false,callback);
			};
			// play single piano note
			this.play = function(name,noteTime){
				piano.sample.playNote(name, noteTime , null );
			};
		}

		// Synth Class
		function Synth () {
			
			// loop create piano sample url and name
			this.sample = new Sample();
			var synth = this;

			var loadParam = {};
			for (var base=9; base<=96 ; base++ ) {
				loadParam[base] = 'synth/'+base+'.mp3';
			}
			
			// batch load piano sample
			this.load = function(callback){
				synth.sample.loadBatch(loadParam,false,callback);
			};
			// play single piano note
			this.play = function(name,noteTime,noteLength){
				synth.sample.playNote(name, noteTime, noteLength ,0.3,1 );
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
				}
			};

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
								}
							}
						);
					} else {
						var buffer = sample.context.createBuffer(request.response, mixToMono);
						sample.buffers[index] = buffer;
						if (++sample.count==sample.total) {
							callback();
						}
					}
				};
				
				request.onerror = function () {
					alert('BufferLoader: XHR error');
				};
				request.send();
			};
			
			// play single note. no mix node
			this.playNote = function( name, noteTime , noteLength , drygain , mastergain ){
				
				drygain = (typeof drygain == 'undefined') ? 1.0 : drygain;
				mastergain = (typeof mastergain == 'undefined') ? 0.8 : mastergain;
				
				// Create the note
				var source = sample.context.createBufferSource();
				source.buffer = sample.buffers[name];
				
				var dryGainNode = sample.context.createGainNode();
				dryGainNode.gain.value = drygain;
				
				// Create master volume.
				masterGainNode = sample.context.createGainNode();
				masterGainNode.gain.value = mastergain; // reduce overall volume to avoid clipping

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
				
				// fade-out and noteOff
				if (typeof noteLength != 'undefined' && noteLength !== null) {
					// fade out before noteOff
					masterGainNode.gain.setValueAtTime(masterGainNode.gain.value,noteTime+(noteLength*0.95));
					masterGainNode.gain.linearRampToValueAtTime(0,noteTime+(noteLength*1.05));
					source.noteOff(noteTime+noteTime+(noteLength*1.05));
				}
			};
			
		}