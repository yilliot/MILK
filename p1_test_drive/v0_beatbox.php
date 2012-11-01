<!DOCTYPE html>
<html>
<head>
	<title>Beat Box</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/_old/audiolib.js" type="text/javascript" ></script>
	<script src="/js/soundgap.basic.mx.js" type="text/javascript" charset="utf-8"></script>
	<style type="text/css" media="screen">
		button.change-bpm{width:45px;}
		.clear{clear:both;}
	</style>
	<script type="text/javascript">
	
	var tempo = 80; // BPM (beats per minute)
	var eighthNoteTime = resetTime(tempo);
	
	var piano = new Piano();
	var beatbox = new BeatBox(piano);
	
	function resetTime (tempo) {
		eighthNoteTime = ( 60 / tempo ) / 2;
		return eighthNoteTime;
	}
	
	function splash ( noteName /*D4*/ ,chordName /*maj7*/ ) {
		var startTime = piano.sample.context.currentTime;
		var chordNotes = MX.Chord.toNotes(noteName,chordName);
		for (var i in chordNotes ) {
			var playtime = startTime+i*eighthNoteTime;
			piano.play(MX.Note.toBase(chordNotes[i]),playtime); //c4
		};
	}

	$(function(){

		// load piano
		piano.load(function(){
			splash('C4','maj7');
			$('#load-piano').remove();
		});

		// generate chord select
		$('#chordType').html(function(){
			var html = '';
			for (var i in MX.Chord.mapNameToPlain ) {
				html += '<option value="'+i+'">'+MX.Chord.mapNameToPlain[i]+'</option>';
			};
			return html;
		});
		
		// generate note select
		$('#rootNote').html(function(){
			var html = '';
			for (var i = 48	; i <= 59; i++){
				var noteName = MX.Note.byBase(i);
				var noteNamePlain = MX.Note.toPlain(noteName);
				html += '<option value="'+noteName+'" >'+noteNamePlain+'</option>';
			}
			return html;
		});
		
		// play piano event
		$('button#add').click(function(e){
			var chordType = $('#chordType').val();
			var rootNote  = $('#rootNote').val();
			beatbox.addBox(rootNote,chordType);
		});
		$('button#play').click(function(e){
			beatbox.play();
		});
		
		// tempo change event
		$('input#bpm').change(function(e){
			var target = $( this );
			$('span#bpm').html(target.val()+' BPM');
			resetTime(target.val());
		});
		$('button.change-bpm').click(function(e){
			var tempo = $( this ).attr('value');
			$('span#bpm').html(tempo+' BPM');
			$('input#bpm').val(tempo);
			resetTime(tempo);
			beatbox.resetJsonFlat();
		});

	});
	</script>
</head>
<body>
<div id="load-piano">
	loading piano...
</div><!-- load-piano -->
<input type="range" name="bpm" value="80" id="bpm" min="30" max="160" style="width:320" />
<span id="bpm"> 80 BPM </span><!-- bpm -->
<div class='clear' style='clear:both'></div>
<button class='change-bpm' value="40"> 40 </button>
<button class='change-bpm' value="60"> 60 </button>
<button class='change-bpm' value="80"> 80 </button>
<button class='change-bpm' value="100"> 100 </button>
<button class='change-bpm' value="120"> 120 </button>
<button class='change-bpm' value="140"> 140 </button>
<div class='clear' style='clear:both'></div>

<select id="rootNote">
</select><!-- rootNote -->
<select id="chordType">
</select><!-- chordType -->

<button id='add'> add BeatBox </button>
<button id='play'> play BeatBox </button>
</body>
</html>