/**
 *	musical exchange object
 **/
window.MX = {
	'Symbol'	:{},
	'Note'		:{},
	'Step'		:{},
	'Interval'	:{},
	'Chord'		:{}
};

window.MX.Symbol = {
	'sharp' : '♯',
	'flat'	: '♭'
};
window.MX.Note = {
	'names'			: ['C','D','E','F','G','A','B'],
	'mapNoteToStep' : {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11},
	'plain'			: { '#':[{'name':'C','accident':0},{'name':'C','accident':1},{'name':'D','accident':0},{'name':'D','accident':1},{'name':'E','accident':0},{'name':'F','accident':0},{'name':'F','accident':1},{'name':'G','accident':0},{'name':'G','accident':1},{'name':'A','accident':0},{'name':'A','accident':1},{'name':'B','accident':0}],
						'b':[{'name':'C','accident':0},{'name':'D','accident':-1},{'name':'D','accident':0},{'name':'E','accident':-1},{'name':'E','accident':0},{'name':'F','accident':0},{'name':'G','accident':-1},{'name':'G','accident':0},{'name':'A','accident':-1},{'name':'A','accident':0},{'name':'B','accident':-1},{'name':'B','accident':0}]},
	'byBase'	:function(base){},
	'byObj'		:function(obj){},
	'byInterval':function(note,interval){},
	'toBase'	:function(note){},
	'toPlain'	:function(note){},
	'toObj'		:function(note){},
	'_accident' :function(int){}
};

window.MX.Step = {
	'mapNumberToHalfstep' : {'1':0, '2':2, '3':4, '4':5, '5':7, '6':9, '7':11 },
	'byNotes'	:function(note1,note2){},
	'byInterval':function(interval){},
	'toNote'	:function(note,step){},
	'toInterval':function(note,step){},
	'_mapNumberToHalfstep'	: function(number){},
	'__roundNumber'			: function(number){}
};

window.MX.Interval = {
	'mapQualityToOffset'	: {'dd':-3,'d':-2,'m':-1,'p':0,'P':0,'M':1,'A':2,'dA':3},
	'mapOffsetToQuality'	: {'-3':'dd','-2':'d','-1':'m','0':'p','1':'M','2':'A','3':'dA' },
	'mapNumberToQType'		: { '1' : 'p', '2' : 's', '3' : 's', '4' : 'p', '5' : 'p', '6' : 's', '7' : 's' },
	'byStep':function(step){},
	'byObj' :function(obj){},
	'toNote':function(note,interval){},
	'toStep':function(interval){},
	'toObj' :function(interval){},
};
// 9, maj9, 
window.MX.Chord = {
	'mapIntervalToChord':{
		'add2'		:['M2','M3','p5'],
		'madd2'		:['M2','m3','p5'],
		'dim'		:['m3','d5'],
		'min'		:['m3','p5'],
		'maj'		:['M3','p5'],
		'aug'		:['M3','A5'],
		'sus2'		:['M2','p5'],
		'sus4'		:['p4','p5'],
		'min6'		:['m3','p5','M6'],
		'maj6'		:['M3','p5','M6'],
		'dim7'		:['m3','d5','d7'],
		'halfdim7'	:['m3','d5','m7'], // half dim7
		'dimmaj7'	:['m3','d5','M7'], // dim maj7
		'min7'		:['m3','p5','m7'],
		'minmaj7'	:['m3','p5','M7'], // min maj7
		'7flat5'	:['M3','d5','m7'], // half dim7
		'dom7'		:['M3','p5','m7'],
		'maj7'		:['M3','p5','M7'],
		'augmin7'	:['M3','A5','m7'], // aug min7
		'augmaj7'	:['M3','A5','M7'], // aug maj7
		'power'		:['p5']
	},
	'mapNameToPlain':{
		'add2'		:'add2',
		'madd2'		:'m(add2)',
		'dim'		:'&ordm;',
		'min'		:'m',
		'maj'		:'∆',
		'aug'		:'+',
		'sus2'		:'Sus2',
		'sus4'		:'Sus4',
		'min6'		:'m6',
		'maj6'		:'6',
		'dim7'		:'&ordm;7',
		'halfdim7'	:'m7(♭5)', // half dim7
		'dimmaj7'	:'dim(Maj7)', // dim maj7
		'min7'		:'m7',
		'minmaj7'	:'m(Maj7)', // min maj7
		'7flat5'	:'7(b5)',
		'dom7'		:'7',
		'maj7'		:'Maj7',
		'augmin7'	:'+7', // aug min7
		'augmaj7'	:'+(Maj7)', // aug maj7
		'power'		:'5'
	},
	'mapRelativeBaseIntervalTree':{
		'2':{
			'3':{
				'7':{
					'name':'madd2'
				}
			},
			'4':{
				'7':{
					'name':'add2'
				}
			},
			'7':{
				'name':'sus2'
			}
		},
		'5':{
			'7':{
				'name':'sus4'
			}
		},
		'3':{
			'6':{
				'name':'dim',
				'9':{
					'name':'dim7'
				},
				'10':{
					'name':'halfdim7'
				},
				'11':{
					'name':'dimmaj7'
				}
			},
			'7':{
				'name':'min',
				'9' :{
					'name':'min6'
				},
				'10':{
					'name':'min7'
				},
				'11':{
					'name':'minmaj7'
				}
			}
		},
		'4':{
			'6':{
				'10':{
					'name':'7flat5'
				}
			},
			'7':{
				'name':'maj',
				'9' :{
					'name':'maj6'
				},
				'10':{
					'name':'dom7'
				},
				'11':{
					'name':'maj7'
				}
			},
			'8':{
				'name':'aug',
				'10':{
					'name':'augmin7'
				},
				'11':{
					'name':'augmaj7'
				}
			}
		},
		'7':{
			'name':'5'
		}
	},
	'mapProgression'	:{
		'family':{0:'maj',2:'min',4:'min',5:'maj',7:'maj',9:'min'}
	},
	'byNotesWithKey'	:function(notes,key){},
	'byNotes'			:function(notes,root){},
	'toNotes'			:function(root,chord) {},
	'_filterRelativeRepeat':function(notes){}
};

/*************************
 *		Note : name => string
 * name : C+14 , for real musical inteprete , complete info
 * base : 0-89 number, for system calculate half step , no interval relation
 * plain : C## , for easy reading , no octave
 * use name for params
 * e.g : C+14 , C-24 , C+03 , C4 , D-23 [name][accident][octave] or [name][octave]
 */

 // @params : flat:true
MX.Note.byBase = function( base , flat ){
	var index = 0;
	var flat = typeof(flat) !== 'undefined' ? flat : true;
	if (flat) {
		var obj = this.plain['b'][base%12];
		obj.octave = Math.floor(base/12);
		return this.byObj(obj);
	
	} else {
		var obj = this.plain['#'][base%12];
		obj.octave = Math.floor(base/12);
		return this.byObj(obj);
	}
	return rs;
};
MX.Note.byBaseAndNote = function( base , note ){

	var noteObj = MX.Note.toObj(note);
	var accident = base - MX.Note.toBase(note);
	noteObj.accident=noteObj.accident+accident;
	return MX.Note.byObj(noteObj);
};

MX.Note.byObj = function( obj ) {
	obj.accident = (obj.accident>=0) ? '+'+parseInt(obj.accident) : parseInt(obj.accident);
	return obj.name + obj.accident + obj.octave;
};

MX.Note.byInterval = function(note,interval){
	return MX.Interval.toNote(note,interval);
};
	
MX.Note.toBase = function(note){
	var obj = this.toObj(note);
	return obj.octave*12 + this.mapNoteToStep[obj.name] + obj.accident;
};

MX.Note.toPlain = function(note){
	var obj = this.toObj(note);
	var accident = this._accident(obj['accident']);
	return obj.name+accident;
};

MX.Note.toObj = function(note){
	var rs = {'name':note[0]};
	if (note[1]=='+'||note[1]=='-') {
		rs.accident = parseInt( note[1]+note[2] );
		rs.octave = note[3];
	} else {
		rs.accident = +0;
		rs.octave = note[1];
	}
	return rs;
};

MX.Note._accident = function(accident){
	var symbol = '';
	if (accident!==0) {
		if (accident>0)
			symbol = '#';
		else
			symbol = 'b';
	}
	return zz.String.repeat(symbol,Math.abs(accident));
};

/*************************
 *		STEP name=>array
 * h : half step e.g c-c=>0, c-e => 4
 * n : note step, number e.g c-c=>1, c-e => 3
 *************************/
MX.Step.byNotes = function(note1,note2){
	
	var n1		= MX.Note.toObj(note1);
	var n2		= MX.Note.toObj(note2);
	
	var indexDist	= MX.Note.names.indexOf(n2.name)-MX.Note.names.indexOf(n1.name);
	var octaveDist	= (n2.octave-n1.octave)*7;
	var tmpDist = octaveDist + indexDist + 1;

	return {
		'h': MX.Note.toBase(note2)-MX.Note.toBase(note1),
		'n': (tmpDist<1) ? tmpDist-2 : tmpDist
	};
};

MX.Step.byInterval = function(interval){
	return MX.Interval.toStep(interval);
};

/* private : transform note and accident*/
MX.Step.toNote = function(note,step){
	var obj = MX.Note.toObj(note);
	var base = parseInt(MX.Note.names.indexOf(obj.name)) + parseInt(step.n);
	var noteIndex = (base%7===0)? 6 : (base%7)-1;
	var newObj = {
		'name':MX.Note.names[noteIndex],
		'accident': parseInt(obj.accident)+parseInt(step.h),
		'octave': parseInt(obj.octave) + Math.floor((base-1)/7)
	};
	return MX.Note.byObj(newObj);
};

// link
MX.Step.toInterval = function(step){
	return MX.Interval.byStep(step);
};

/* private : map number to halfstep */
MX.Step._mapNumberToHalfstep = function ( number ) {
	return MX.Step.mapNumberToHalfstep[MX.Step.__roundNumber(number)] + (12*Math.floor((number-1)/7));
};
/* private : round number */
MX.Step.__roundNumber = function (number){
	return ( (number - 1) %7 ) +1;
};

/*************************
 *		Interval name=>string
 * name : [step.n][interval.display] e.g M6
 *************************/

MX.Interval.byObj = function(obj){
	var rs = obj.quality+''+obj.number;
	return rs;
};

MX.Interval.byNotes = function( note1 , note2 ) {
	return MX.Interval.byStep( MX.Step.byNotes(note1,note2) );
};


MX.Interval.byStep = function ( step ) {
	
	var halfstep		= MX.Step._mapNumberToHalfstep(step.n);
	var offset			= step.h - halfstep;
	var offsetNumber	= MX.Step.__roundNumber(step.n);

	if (MX.Interval.mapNumberToQType[offsetNumber]=='p') { // perfect
		if (offset !==0) { /*exclude major and minor value for perfect type*/
			offset = (offset>0)?offset+1:offset-1;
		}
	} else { // major or minor
		offset = (offset>=0)?offset+1:offset;
	}
	return step.n+MX.Interval.mapOffsetToQuality[offset];
};

MX.Interval.toNote = function ( note , interval ){
	
	var base = MX.Note.toBase(note);
	var step = MX.Interval.toStep(interval);
	note = MX.Step.toNote(note,{n:step.n,h:0});
	base = base + step.h;
	var name	= MX.Note.byBaseAndNote(base,note);
	return name;
};
MX.Interval.toStep = function(interval){
	var obj			= MX.Interval.toObj(interval);
	var halfstep	= MX.Step._mapNumberToHalfstep(obj.number);
	var offset		= MX.Interval.mapQualityToOffset[obj.quality];

	if (obj.qtype == 'p') {
		if (offset !==0) { /*exclude major and minor value for perfect type*/
			offset = (offset>0)?offset-1:offset+1;
		}
	} else { /*major and aug -1, revert offset*/
		offset = (offset>0)?offset-1:offset;
	}
	if (obj) {
		
		return {'n':obj.number,'h':halfstep+offset};
	}
	return false;
};

MX.Interval.toObj = function ( interval ) {
		
	var obj = {
		'number'	: interval.replace(/[^\d]/g,''),
		'quality'	: interval.replace(/[\d]/g,'')
	};

	// validation
	if ( !obj.number || obj.number === 0 ) { // no 0 interval
		return false;
	}
	var nStepInOctave = MX.Step.__roundNumber(obj.number);
	if ( [1,4,5].indexOf(nStepInOctave) != -1 ) {
		obj.qtype = 'p';
		if (['m','M'].indexOf(obj.quality) != -1 ) {// if found m || M return false
			return false;
		}
	} else {
		obj.qtype = 'm';
		if (['p','P'].indexOf(obj.quality) != -1 ) {// if found P return false
			return false;
		}
	}
	
	if ( !obj.quality || ['p','P','m','M','d','A','dd','dA'].indexOf(obj.quality)==-1) {
		return false;
	}

	return obj;
};

/*************************
 *		Chord name=>string
 * name : [base] [extension] [step] e.g minmaj7
 *************************/

MX.Chord.toPlain = function( name ){
	return MX.Chord.mapNameToPlain[name];
};

MX.Chord.byNotes = function( notes , root ) {

	// filter repeat value
	notes = MX.Chord._filterRelativeRepeat(notes);

	// not order + conservative
	if (typeof(root)==='undefined') {
		
		var permute = zz.Array.permute(notes);
		var stack = {'extend':[],'wrap':[]};
		for (var i in permute ) {
			// all set of permutation
			// console.log(permute[i]);
			var rs = _extendFromRoot(permute[i],permute[i][0]);
			if (rs) stack.extend.push(rs);
		};
		
		// method 2
		//console.log(notes);
		for (var i in notes ) {
			var rs = _wrapByNotes(notes,notes[i]);
			if (rs) stack.wrap.push(rs);
		};

		return stack;
	// in order + conservative
	} else {
		if (notes[0]==root) {
			return _extendFromRoot(notes,root);
		};
		// alterbass? dont ask me this kind of thing k? take out the bass put in the root
		return false;
	};
	/*****
	 * offset notes to "InOrder" to completely match the higher extend of a Chord pattern
	 * return {root, chord, contact, missed}
	 * e.g c e g b will match c e g b , e g b
	**/
	function _extendFromRoot (notes,root) {
		
		var mapCursor = MX.Chord.mapRelativeBaseIntervalTree;
		var lasthalfstep = 0;
		var contact = [root]; 	// notes contact the chord patter,at least contact a root
		var missed = []; 	// notes missed, out of scope
		
		for (var i in notes ) {
			
			if (i!=0) {
				var note = notes[i];
				
				// make current note higher than root
				while (MX.Note.toBase(root)>MX.Note.toBase(note))
					note = MX.Note.byInterval( note , 'p8' );
				
				var halfstep = MX.Interval.toStep(MX.Interval.byNotes(root,note)).h;
				
				// make current note higher than last note
				while(halfstep<lasthalfstep)
					halfstep+=12;
				// lower current note if 12 step higher than last note
				while(halfstep>lasthalfstep+12)
					halfstep-=12;
					
				lasthalfstep = halfstep;
				if (typeof mapCursor[halfstep] !== 'undefined'){
					mapCursor = mapCursor[halfstep];
					contact.push(note);
				} else {
					missed.push(note);
				}
			};
		};
		if (typeof mapCursor.name !== 'undefined')
			return {
				'root':root,
				'name':mapCursor.name,
				'contact':contact,
				'missed':missed,
			};
		else
			return false;
	};
	/*****
	 * offset notes to "round" in an octave base on root, match all contained notes on chords patterns
	 * return {root, chord, contact}
	 * e.g c e will match c e g b , d f+1 a c e etc
	**/
	function _wrapByNotes (notes,root) {

		var map = MX.Chord.mapIntervalToChord;
		var rootstep = MX.Note.toBase(root);
		var roundsteps = [];
		var result = [];
		
		for (var i in notes ) {
			
			if (notes[i]!=root) {
				
				var note = notes[i];
				
				// make current note higher than root
				while (rootstep>MX.Note.toBase(note))
					note = MX.Note.byInterval( note , 'p8' );
				
				var halfstep = MX.Interval.toStep(MX.Interval.byNotes(root,note)).h;
				
				// lower current note if 12 step higher than root
				while(halfstep>12)
					halfstep-=12;
					
				roundsteps.push(halfstep);
			};
		};
		roundsteps.sort(function(a,b){return a - b;});
		
		//console.log(roundsteps);
		for (var chordname in map ) {
			
			var flag = true;
			var pat = map[chordname];
			var contact = [];
			//console.log(pat);
			
			for (var j in pat ) {
				//console.log( MX.Interval.toStep(pat[j]).h );
				if( roundsteps.indexOf(MX.Interval.toStep(pat[j]).h) == -1) {
					flag = false;
					break;
				}
				contact.push(pat[j]);
			};
			
			if (flag) {
				result.push({
					'root':root,
					'name':chordname,
					'contact':contact,
				});
			};
		};
		return (result.length!==0)?result:false;
	}
};

MX.Chord.toNotes = function( root , chord ){
	var intervals = MX.Chord.mapIntervalToChord[chord];
	var notes = [root];
	for (var i in intervals ) {
		if(typeof(intervals[i])==='string')
			notes.push( MX.Interval.toNote( root , intervals[i] ) );
	};
	return notes;
}

// if d-25,c4, filter c4
MX.Chord._filterRelativeRepeat = function(notes){
	
	for (var i in notes ) {
		//console.log( notes[i] );
		for (var j in notes ) {
			//console.log( notes[j] );
			if (i!==j) {
				if ((MX.Note.toBase(notes[i])%12)===(MX.Note.toBase(notes[j])%12)) {
					notes.splice(j,1)
				};
			};
		};
	};
	return notes;
}