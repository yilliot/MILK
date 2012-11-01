<!DOCTYPE html>
<html>
<head>
	<title>SoundGap Box</title>
	<script src='/js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="/js/soundgap.basic.js" type="text/javascript"></script>
	<script src="/js/soundgap.basic.mx.js" type="text/javascript" charset="utf-8"></script>
	<script src="/js/soundgap.ext.audio.js" type="text/javascript"></script>
	<link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/css/docs.css">
	<link rel="stylesheet" type="text/css" href="midi-function.css">
	<script type="text/javascript">
	$(function(){
		audio_player = new SoundGap.controller();

		$('#song-pause').click(function(){
			audio_player.pause();
		});
		$('#song-play').click(function(){
			audio_player.play();
		});

		init_html();
		init_event();
	});

	function init_html () {
		$('#chord-type').html(get_chord_type_options());
	}

	function init_event () {

		$('#save-default-slot-section').click(function(){
			SoundGap.generator.setting = {
				'bpm':$('#default_slot_section #tempo').val(),
				'nn' :$('#default_slot_section #nn').val(),
				'dd' :$('#default_slot_section #dd').val(),
				'sf' :$('#default_slot_section #sf').val(),
				'mi' :$('#default_slot_section #mi').val()
			};
		});


		$('#create-track-section').click(function(){
			$('#create_track_section').show('slide');
			// reset track name field
			// $('#create_track_section input#track_name').val('');
			// reset loading
			$('#track-control-add').removeAttr('disabled');
		});

		$('button#slot-default-setting').click(function(){
			$('#default_slot_section').toggle('slide');
			$('#default_slot_section #tempo').val(SoundGap.generator.setting.bpm);
			$('#default_slot_section #nn').val(SoundGap.generator.setting.nn);
			$('#default_slot_section #dd').val(SoundGap.generator.setting.dd);
			$('#default_slot_section #sf').val(SoundGap.generator.setting.sf);
			$('#default_slot_section #mi').val(SoundGap.generator.setting.mi);

		});

		$('#track-control-add').click(function(){
			var track_name   = $('#create_track_section input#track_name').val();
			var track_volume = $('#create_track_section input#track_volume').val();
			var instrument   = $('#create_track_section select#instrument').val();
			track_name = (track_name=='') ? instrument : track_name ;
			$(this).attr('disabled','disabled');
			audio_player.create_track(instrument,track_volume,function(id){
				var track_html = $(get_track_html(id,track_name));
				$('#track-container #tracks-holder').append(track_html);
				init_track_event($(track_html));				
				$('#track-control-add').removeAttr('disabled');

			});
		});

		// general button
		$('.section-close-button').click(function(){
			$(this).closest('.modal').hide('slide');
		});

	}


	function init_track_event (track) {

		$('#track-container div.track button.track-control-delete').unbind('click');
		$('#track-container div.track button.track-control-delete').click(function(){
			target = $(this).closest('div.track');
			var tid = target.attr('tid');
			audio_player.delete_track(tid);
			target.remove();
		});

		$('button#track-control-edit').unbind('click');
		$('button#track-control-edit').click(function(){
			target = $(this);
			if (target.hasClass('active')) {
				$('div.track div.edit').hide();
				target.removeClass('active');
			} else {
				$('div.track div.edit').show();
				target.addClass('active');
			}
		});
		var track_id = track.attr('tid');
		track.find('button#track-addslot').click(function(){
			var slot_id = audio_player.create_slot(track_id);
			var slot_html = $('<span class="slot" sid="'+slot_id+'"></span>');
			init_slot_event(slot_html,slot_id);
			track.find('#slots-holder').append(slot_html);
		});
	}

	function init_slot_event(slot,slot_id) {
		slot.click(function(){
			console.log( slot_id );
		});
	}

	function get_chord_type_options (selected) {
		var html = '';
		selected = (typeof(selected) == 'undefined') ? 'maj' : selected_option ;
		var selected_option = '';
		for (var i in MX.Chord.mapNameToPlain ) {
			if (selected==i) selected_option = 'selected';
			html += '<option value="'+i+'" '+selected_option+' >'+MX.Chord.mapNameToPlain[i]+'</option>';
			selected_option = '';
		};
		return html;
	}


	function get_track_html (id,track_name) {
		return "<div class='track' tid='"+id+"'>" +
				"<div class='track-header'>" +
					"<div class='btn-group edit'>" +
						"<button class='btn btn-mini track-control-delete' ><i class='icon-trash'></i></button>" +
						"<button class='btn btn-mini track-control-edit' ><i class='icon-pencil'></i></button>" +
					"</div>" +
					"<div class='identity'>" +
						"<span class='icon'><i class='icon-music'></i></span>" +
						"<span class='label'>"+track_name+"</span>" +
					"</div>" +
				"</div>" +
				"<div class='track-body'>" +
					"<div id='slots-holder'>" +
					"</div>" +
					"<button id='track-addslot' class='btn btn-mini'><i class='icon-plus'></i></button>" +
					"<div class='clearfix'></div>" +
				"</div>" +
				"<div class='clearfix'></div>" +
			"</div>";
	}
	</script>
</head>
<body class='container'>

	<div class='navbar navbar-fixed-top'>
		<div class='btn-group container'>
			<span>Track Control : </span>
			<button id='create-track-section' class='btn'><i class='icon-plus'></i></button>
			<button id='track-control-edit'   class='btn'><i class='icon-pencil'></i></button>
			<button id='slot-default-setting' class='btn'><i class='icon-tasks'></i></button>
			<button class='btn' id='song-pause'>Pause</button>
			<button class='btn' id='song-play'>Play</button>
		</div>
	</div>
	<hr>

	<div id='track-container'>
		<div id='tracks-holder'></div>
	</div>


	<div id="create_track_section" class='modal hide'>
		<div class="modal-header">
			<h3 id="create_track_section_label">New Track</h3>
		</div>
		<div class="modal-body">
			<div class="control-group">
				<label>Track Name</label>
				<div class="controls">
					<input type='text' id='track_name' class='span3' placeholder='E.G. Lead Guitar' />
				</div>
			</div>

			<div class="control-group">
				<label>Choose Instrument</label>
				<div class="controls">
					<select id='instrument'>
						<option value='piano'>Piano</option>
						<option value='guitar'>Guitar</option>
						<option value='string'>String</option>
						<option value='bass'>Bass</option>
						<option value='synth'>Synth</option>
						<option value='chord'>Chord</option>
					</select>
				</div>
			</div>
			<a class='click-expand-next'>... show more ...</a>
			<div class='expandable hide'>
				<div class="control-group">
					<label>Volume</label>
					<div class="controls">
						<input id='track_volume' type='range' min="0" max="1" step="0.01" value='0.8' />
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button id='hide-track-section' class="btn section-close-button" >Close</button>
			<button id='track-control-add' class="btn btn-primary">Create</button>
		</div>
	</div>


	<div id="default_slot_section" class='modal hide'>
		<div class="modal-header">
			<h3 >Slot Default Setting</h3>
		</div>
		<div class="modal-body">
			<div class="control-group">
				<label>Tempo</label>
				<div class="controls">
					<input type='number' id='tempo' class='span1' value='80' />
				</div>
			</div>

			<div class="control-group">
				<label>Time Signature</label>
				<div class="controls">
					<input type='text' name='nn' id='nn' value='4' style='width:14px;text-align:center;' /> /
					<input type='text' name='dd' id='dd' value='4' style='width:14px;text-align:center;' />
				</div>
			</div>
			<div class="control-group">
				<label>Key</label>
				<div class="controls">
					<select id='mi' style='width:80px'>
						<option value='0'>Major</option>
						<option value='1'>Minor</option>
					</select>
					<select id='sf' style='width:60px'>
						<option value='-7'>Cb</option>
						<option value='-6'>Gb</option>
						<option value='-5'>Db</option>
						<option value='-4'>Ab</option>
						<option value='-3'>Eb</option>
						<option value='-2'>Bb</option>
						<option value='-1'>F</option>
						<option value='0' selected>C</option>
						<option value='1'>G</option>
						<option value='2'>D</option>
						<option value='3'>A</option>
						<option value='4'>E</option>
						<option value='5'>B</option>
						<option value='6'>F#</option>
						<option value='7'>C#</option>
					</select>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button id='hide-default-slot-section' class="btn section-close-button" >Close</button>
			<button id='save-default-slot-section' class="btn btn-primary section-close-button">Save Setting</button>
		</div>
	</div>



	<div id="create_slot_section" class='modal'>
		<div class="modal-header">
			<h3 id="create_slot_section_label">New Slot</h3>
		</div>
		<div class="modal-body">
			<div class="control-group">
				<label>Chord</label>
				<div class="controls">
					<select id='chord-root' style='width:60px'>
						<option value='0'>N.C</option>
						<option value='1' selected>C</option>
						<option value='2'>C#/Db</option>
						<option value='3'>D</option>
						<option value='4'>D#/Eb</option>
						<option value='5'>E</option>
						<option value='6'>F</option>
						<option value='7'>F#/Db</option>
						<option value='8'>G</option>
						<option value='9'>G#/Ab</option>
						<option value='10'>A</option>
						<option value='11'>A#/Bb</option>
						<option value='12'>B</option>
					</select>
					<select id='chord-type' style='width:80px'>
					</select>

				</div>
			</div>

			<div class="control-group">
				<label>Companion Type</label>
				<div class="controls">
					<select id='voice' class='span3'>
						<option value='0'  > Rest </option>
						<option value='1'  > Chord </option>
						<option value='2'  > Chord Root + Chord </option>
						<option value='3'  > Chord 1st 3rd 4th </option>
						<option value='11' > Arpegios 8th </option>
						<option value='12' > Arpegios 8th 3+3+2 </option>
						<option value='13' > Arpegios 16th 3+3+3+3+2+2 </option>
						<option value='999'> Custom </option>
					</select>
				</div>
			</div>


			<div class="control-group">
				<label>Root Register</label>
				<div class="controls">
					<input type='number' value='3' class='span1' />
				</div>
			</div>
			<a class='click-expand-next'>... show more ...</a>
			<div class='expandable hide'>
				<div class="control-group">
					<label>Voicing</label>
					<div class="controls">
						<select id='voice' class='span3'>
							<option value='1' selected> Root</option>
							<option value='2' selected> 2nd</option>
							<option value='3' selected> 3rd</option>
							<option value='4' selected> 4th</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button id='hide-slot-section' class="btn section-close-button" >Close</button>
			<button id='create-slot-section' class="btn btn-primary">Save Setting</button>
		</div>
	</div>
</body>
</html>