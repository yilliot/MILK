<?php
$octs = array(0,1,2,3,4,5,6);
$notes = array('C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B');
$preview = array('A'=>'A','As'=>'A&#9839;','B'=>'B','C'=>'C','Cs'=>'C&#9839;','D'=>'D','Ds'=>'D&#9839;','E'=>'E','F'=>'F','Fs'=>'F&#9839;','G'=>'G','Gs'=>'G&#9839;');
?>
<!DOCTYPE html>
<html lang="en-GB">
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>piano</title>
	<script type='text/javascript' src='/js/jquery-1.7.1.min.js'></script>
</head>
<body>
	<ul class='nolist touchpad' style='width:1050px;'>
		<?php foreach ($octs as $oct): ?>
			<?php foreach ($notes as $note): ?>
				<?php if (false&&$note=='C'): ?>
					<li class='clear'></li>
				<?php endif ?>
				<?php $color = (strlen($note)>1)?'black':'white'; ?>
				<li class='key <?php echo $color ?> noselect' ogg="<?php echo $oct.$note ?>"><?php echo $preview[$note] ?></li>
			<?php endforeach ?>
		<?php endforeach ?>
	</ul>
<style type="text/css" media="screen">
	
	ul.nolist{list-style:none;padding:0;margin:0;}
	ul.touchpad li.key{padding:0;margin:0;margin-left:-5px;display:inline-block;width:20px;height:20px;border:1px solid #CCC;font:normal 8pt tahoma;text-align:center;cursor:pointer;}
	ul.touchpad li.black{background-color:#000;color:#FFF;position:absolute;margin-left:-12px;width:15px;height:50px;border:1px solid #FFF;}
	ul.touchpad li.white{padding-top:60px;}
	.clear{clear:both;border:0;width:100%;height:10px;}
	.noselect{-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;}
</style>
<script type="text/javascript" charset="utf-8">
	var samples = [];
	$(function(){
		$('li.key').each(function(e){
			var target = $( this );
			var name  = target.attr('ogg');
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', '/samples/ogg/'+name+'.ogg');
			//audioElement.setAttribute('src', 'mp3/'+name+'.mp3');
			audioElement.load();
			target.mousedown(function(e){
				audioElement.play();
			});
			audioElement.addEventListener("load", function() {
				audioElement.play();
			}, true);
			samples[name]=audioElement;

		});
	});
</script>
</body>	
</html>