<!DOCTYPE html5>
<html>
<head>
	<title>Test Sound</title>
	<script src='../js/jquery-1.5.2.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="../js/audiolib.js" type="text/javascript" ></script>
	<script type="text/javascript">
	var tempo = 80; // BPM (beats per minute)
	var eighthNoteTime = (60 / tempo) / 2;
	var piano = new Piano();

	function play7 () {
		var startTime = piano.sample.context.currentTime;
		piano.play('48',startTime+0*eighthNoteTime); //c4
		piano.play('52',startTime+1*eighthNoteTime); //e4
		piano.play('55',startTime+2*eighthNoteTime); //g4
		piano.play('59',startTime+3*eighthNoteTime); //b4

	}

	$(function(){

		piano.load(function(){
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