<!DOCTYPE html>
<html>
<head>
	<title>Hearing Test</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/_old/audiolib.js" type="text/javascript" ></script>
	<script src="/js/soundgap.basic.mx.js" type="text/javascript" charset="utf-8"></script>

	<style type="text/css" media="screen">
		button.chordbox{width:50px;display:inline-block;}
		div.chordbox{width:50px;display:inline-block;border:1px solid #AAA;text-align:center;padding:20px;margin:1px;}
		.clear{clear:both;}
	</style>
	<script type="text/javascript">
	var names = {
		'I7'	:'I 7',
		'ii7'	:'ii 7',
		'Imaj'	:'I',
		'Imaj7'	:'I Maj7',
		'Imin'	:'i',
		'Imin7'	:'i 7',
		'IV7'	:'IV 7',
		'IVmaj'	:'IV',
		'IVmin7':'iv 7',
		'V7'	:'V 7',
		'vi'	:'vi',
		'vi7'	:'vi 7',
		'Vmaj'	:'V',
		'Vmin7'	:'v 7'
	};
	var tempo = 90; // BPM (beats per minute)
	var eighthNoteTime = resetTime(tempo);
	
	var chord_sample = new HarmonizeChord();
	var piano_sample = new Piano();
	
	function resetTime (tempo) {
		eighthNoteTime = ( 60 / tempo ) / 2;
		return eighthNoteTime;
	}
	
	function splash ( chord /*Imaj7*/ ) {
		//var startTime = chord_sample.sample.context.currentTime;
		piano_sample.load(function(){
			var startTime = piano_sample.sample.context.currentTime;
			piano_sample.play('48',startTime); //c4
		});
		//var playtime = startTime;//+i*eighthNoteTime;
		//chord_sample.play(chord,playtime); //c4
	}

	function play_chord_progression( cp ) {

		var startTime = chord_sample.sample.context.currentTime;
		for (var i in cp ) {
			var playtime = startTime+i*eighthNoteTime*8;
			chord_sample.play(cp[i],playtime);
		}
	}
	function play_chord( chord ) {
		var playtime = chord_sample.sample.context.currentTime;
		chord_sample.play(chord,playtime);
	}
	function generateCp(){
		var chords = ['I7','ii7','Imaj','Imaj7','Imin','Imin7','IV7','IVmaj','IVmin7','V7','vi','vi7','Vmaj','Vmin7'];
		return [
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)]];
	}

	$(function(){
		// load chord_sample
		var cp = generateCp();
		chord_sample.load(function(){
			splash('Imaj7');
			$('#load-chord_sample').remove();
		});
		$('#play').click(function(){
			play_chord_progression(cp);
		});
		
		$('#answer').click(function(){
			var cphtml = '';
			for (var i in cp ) {
				var name = names[cp[i]];
				cphtml += '<div class="chordbox">'+name+'</div>';
			}
			$('#show-answer').html(cphtml);
		});
		$('button.chordbox').click(function(){
			//if ($('#my-answer').children().size()<4) {
				var name = names[$(this).attr('value')];
				var node = $('<div class="chordbox" value="'+$(this).attr('value')+'">'+name+'</div>');
				node.click(function(){
					play_chord(node.attr('value'));
				});
			//};
			$('#my-answer').append(node);
		});
		$('button#clear').click(function(){
			$('#my-answer').html('');
		});
	});
	</script>
</head>
<body>
<div id="load-chord_sample">
	loading chord_sample...
</div><!-- load-chord_sample -->


<div style='height:180px;'>
	<div id='my-answer' style='text-align:center;height:90px;'></div>
	<div style='position:relative;'>
		<h2 style='position:absolute;left:100px;'>Answer:</h2>
		<div id='show-answer' style='text-align:center;'></div>
	</div>
</div>

<div class='clear' ></div>
<div style='width:300px;margin:auto;text-align:center;'>
	<button class='chordbox' value='Imaj'> I </button>
	<button class='chordbox' value='Imaj7'> I maj7 </button>
	<button class='chordbox' value='I7'> I 7 </button>
	<button class='chordbox' value='Imin'> i </button>
	<button class='chordbox' value='Imin7'> i 7 </button>
	<div class='clear'></div>

	<button class='chordbox' value='ii7'> ii 7 </button>
	<div class='clear'></div>

	<button class='chordbox' value='IVmaj'> IV </button>
	<button class='chordbox' value='IV7'> IV 7 </button>
	<button class='chordbox' value='IVmin7'> iv 7 </button>
	<div class='clear'></div>

	<button class='chordbox' value='Vmaj'> V </button>
	<button class='chordbox' value='V7'> V 7 </button>
	<button class='chordbox' value='Vmin7'> v 7 </button>
	<div class='clear'></div>

	<button class='chordbox' value='vi'> vi </button>
	<button class='chordbox' value='vi7'> vi 7 </button>
	<div class='clear' style='clear:both'></div>

	<div class='clear' style='clear:both'></div>

	<button id='play'> PLAY Chords </button>
	<button id='answer'> Show Answer </button>
	<button id='clear'> Clear Screen</button>
</div>


</body>
</html>