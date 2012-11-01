<!DOCTYPE html>
<html>
<head>
	<title>SoundGap Box</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript"></script>
	<script src="/js/soundgap.basic.mx.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/soundgap.ext.audio.js" type="text/javascript"></script>
	<script src="/js/soundgap.app.tvbox.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css">
	<style type="text/css" media="screen">
		div.answer_button{width:50px;display:inline-block;border:1px solid #AAA;text-align:center;padding:20px;margin:1px;}
		.clear{clear:both;}
		span.cursor{color: transparent; display: inline; z-index: 0; position: absolute;background-color:#FFF; size:20pt;}
		div#loading_wheel{position:fixed;background-color:white;top:0;bottom:0;left:0;right:0;z-index:1000;padding-top:100px;text-align:center;}
		div#aquarium{height:320px;border:1px solid #000;background-color:#000;}
		div#aquarium div#tv ul {width:500px;margin:100px auto 0 auto;}
		div#aquarium div#tv ul li{display:block;float:left;margin:1px;width:120px;height:80px;border:1px solid #333;background-color:#222;}
		div#aquarium div#tv ul li div.answer_box{color:#EEE;text-align:center;margin-top:30px;}

		div#aquarium div#tv ul li.active{border:0;background-color:#DDD;box-shadow:#FFF 0px 0px 30px;}
		div#aquarium div#tv ul li.active div.answer_box{color:#000;}

		div#aquarium div#tv ul li.wrong div.answer_box{color:red!important;}

		div#aquarium div#tv-control ul {text-align:center;margin-top:20px;}
		div#aquarium div#tv-control ul li{display:inline-block;}

		div#aquarium div#tv-console {margin:30px auto 0 auto;width:483px;color:#EEE;background-color:#222;padding:4px 10px;font-family:"Monaco", "Courier New", monospace}
		div#aquarium div#tv-console span.btn{margin-right:4px;}
		div#aquarium span#console-input.active{color:orange;}

		div#answer_box{height:280px;border:1px solid #FFF;background-color:#FFF;}
		div#answer_box ul {text-align:center;margin-top:40px;}
		div#answer_box ul li {width:80px;display:inline-block;}
		div#answer_box ul li button.answer_button{width:80px;display:block;}
	</style>
	<script type="text/javascript">
	var code_display_pair = {
		'I7'	:'I 7',
		'Imaj'	:'I',
		'Imaj7'	:'I Maj7',
		'Imin'	:'i',
		'Imin7'	:'i 7',
		'ii7'	:'ii 7',
		'IV7'	:'IV 7',
		'IVmaj'	:'IV',
		'IVmin7':'iv 7',
		'V7'	:'V 7',
		'Vmaj'	:'V',
		'Vmin7'	:'v 7',
		'vi'	:'vi',
		'vi7'	:'vi 7'
	};
	var answer_button_array = [
		['Imaj','Imaj7','I7','Imin','Imin7'],
		['ii7'],
		['IV7','IVmaj','IVmin7'],
		['V7','Vmaj','Vmin7'],
		['vi','vi7']
	];
	var tempo = 90; // BPM (beats per minute)
	var eighthNoteTime = resetTime(tempo);
	
	var chord_sample = new HarmonizeChord();
	var piano_sample = new Piano();
	
	function resetTime (tempo) {
		eighthNoteTime = ( 60 / tempo ) / 2;
		return eighthNoteTime;
	}
	
	function play_chord( chord ) {
		var playtime = chord_sample.sample.context.currentTime;
		chord_sample.play(chord,playtime);
	}

	function generate_chord_progression(){
		var chords = ['I7','ii7','Imaj','Imaj7','Imin','Imin7','IV7','IVmaj','IVmin7','V7','vi','vi7','Vmaj','Vmin7'];
		return [
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)],
			chords[Math.floor(Math.random() * chords.length)]];
	}


	$(function(){
		// load chord_sample
		quest_answers = generate_chord_progression();
		chord_sample.load(function(){
			piano_sample.load(function(){
				var startTime = piano_sample.sample.context.currentTime;
				piano_sample.play('48',startTime); //c4
				$('#loading_wheel').fadeOut('slow',function() { $(this).remove(); });
			});
		});

		initEvent(quest_answers);
	});

	</script>
</head>
<body >
<div id="loading_wheel">
	<h1>Loading chord and sound...</h1>
</div><!-- loading_wheel -->


<div id='aquarium'>
	<div id='tv'>
		<ul class='unstyled'>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</div>
	<div class='clearfix'></div>
	<div id='tv-console'>
		<span><span>&gt;&nbsp;</span><span id='console-input'></span><span class="cursor" >&nbsp;</span><span style="position: relative; "></span></span>
	</div>
	<div id='tv-control'>
		<ul class='unstyled'>
			<li><button class='btn' id='btn-play'><i class="icon-play"></i></button></li>
			<li><button class='btn' id='btn-repeat'><i class="icon-repeat"></i></button></li>
		</ul>
	</div>
</div>

<div class='clear' ></div>
<div id='answer_box'>
	<ul class='unstyled'></ul>
</div>
</body>
</html>