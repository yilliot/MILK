<?php
$octs = array('00','0','1','2','3','4','5','6','7');
$notes = array('C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B');
$preview = array('A'=>'A','As'=>'A&#9839;','B'=>'B','C'=>'C','Cs'=>'C&#9839;','D'=>'D','Ds'=>'D&#9839;','E'=>'E','F'=>'F','Fs'=>'F&#9839;','G'=>'G','Gs'=>'G&#9839;');
$base=0;
chdir('base');
?>

<ul>
	<?php foreach ($octs as $oct): ?>
		<?php foreach ($notes as $note): ?>
			<?php //rename($oct.$note.'.mp3',$base.'.mp3'); ?>
			<li >
				<?php echo $oct.$note ?>.mp3
				=>
				<?php echo $base++; ?>.mp3
			</li>
		<?php endforeach ?>
	<?php endforeach ?>
</ul>