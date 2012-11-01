<!DOCTYPE html>
<html>
<head>
	<title>Test Sound</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript" ></script>
	<script src="/js/soundgap.ext.audio.js" type="text/javascript" ></script>
	<script type="text/javascript">
	var bpm = 80; // BPM (beats per minute)
	var piano_track = {};

	function play7 () {
		var startTime = SoundGap.audio_context.currentTime;

		// create slot : convert bpm to system tempo
		var tmp_slot = new SoundGap.slot();
		tmp_slot.config.bpm = bpm;
		tmp_slot.init();
		var tempo = tmp_slot.app_setup.tempo;

		// create note : name and value
		var tmp_note = new SoundGap.note();
		tmp_note.config.notename = '48';
		tmp_note.config.start  = 0;
		tmp_note.config.length = 48;
		tmp_note.init(tempo);

		piano_track.play_note( startTime , tmp_note );
	}

	$(function(){
		piano_track = new SoundGap.track();
		piano_track.config.instrument = 'piano';
		piano_track.init(function(){
			
			play7();
			$('#load-piano').remove();
		});

		$('#noise').click(function(e){
			play7();
		});

	});
	</script>
</head>
<body>
<div id="load-piano">
	loading piano...
</div><!-- load-piano -->
<div id='noise'>Make Noise</div>


</body>
</html>