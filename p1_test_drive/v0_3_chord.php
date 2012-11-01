<!DOCTYPE html>
<html>
<head>
	<title>Play Me Chord</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/_old/audiolib.js" type="text/javascript" ></script>
	<script src="/js/soundgap.basic.mx.js" type="text/javascript" charset="utf-8"></script>
	
	<script type="text/javascript">
	
	var tempo = 80; // BPM (beats per minute)
	var eighthNoteTime = (60 / tempo) / 2;
	var piano = new Piano();

	function play ( noteName /*D4*/ ,chordName /*maj7*/ ) {
		var startTime = piano.sample.context.currentTime;
		var chordNotes = MX.Chord.toNotes(noteName,chordName);
		for (var i in chordNotes ) {
			var playtime = startTime+i*eighthNoteTime;
			piano.play(MX.Note.toBase(chordNotes[i]),playtime); //c4
		};
	}

	$(function(){

		piano.load(function(){
			play('C4','maj7');
			$('#load-piano').remove();
		});

		$('#chordType').html(function(){
			var html = '';
			for (var i in MX.Chord.mapNameToPlain ) {
				html += '<option value="'+i+'">'+MX.Chord.mapNameToPlain[i]+'</option>';
			};
			return html;
		});
		$('#rootNote').html(function(){
			var html = '';
			for (var i = 48	; i <= 59; i++){
				var noteName = MX.Note.byBase(i);
				var noteNamePlain = MX.Note.toPlain(noteName);
				html += '<option value="'+noteName+'" >'+noteNamePlain+'</option>';
			}
			return html;
		});
		$('#play').click(function(e){
			var chordType = $('#chordType').val();
			var rootNote  = $('#rootNote').val();
			play(rootNote,chordType);
		});

	});
	</script>
</head>
<body>
<div id="load-piano">
	loading piano...
</div><!-- load-piano -->

<select id="rootNote">
</select><!-- rootNote -->
<select id="chordType">
</select><!-- chordType -->

<button id='play'> Play for Me </button>
</body>
</html>