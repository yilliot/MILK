
var song_is_play        = false;
var console_value       = '';
var user_answers        = [];
var quest_answers       = [];
var user_answers_index  = 0;

function initEvent( quest_answers ){

	// generate answer box
	for (var i in answer_button_array ) {
		var answer_cat = $('<li class="answer_cat"></li>');
		for (var j in answer_button_array[i] ) {
			var code = ( answer_button_array[i][j] );
			var display = code_display_pair[code];
			var answer_button = $('<button class="btn answer_button" value="'+code+'"> '+display+' </button>');
			answer_cat.append(answer_button);
		}
		$('div#answer_box ul').append(answer_cat);
	}
	$('div#answer_box ul button.answer_button').click(function(){
		console_value = $(this).attr('value');
		console_value_to_user_answers();
		update_console_display();
	});

	update_box_display();

	$('#btn-play').click(function(){

		var target = $(this);

		if (song_is_play) {
			song_is_play = false;
			pause_quest_answers();
			changeIconToPlay(target);
		} else {
			song_is_play = true;
			play_quest_answers(quest_answers);
			changeIconToPause(target);
		}

		function changeIconToPlay(target){
			target.children('i').removeClass('icon-pause');
			target.children('i').addClass('icon-play');
		}
		function changeIconToPause(target){
			target.children('i').removeClass('icon-play');
			target.children('i').addClass('icon-pause');
		}
	});
	// navigation of answer_box
	$('div#tv ul li').click(function(){
		user_answers_index = $('div#tv ul li').index($(this));
		update_box_display();
	});

	$('body').keydown(function(e){
		var k = e.which;
		if (
			k == 8  || // backspace
			k == 13 || // enter
			k == 9  || // tab
			k == 32 || // space
			k == 8 //
		) {
			e.preventDefault();
		}
		if (
			k == 16 || // shift
			k == 17 || // ctrl
			k == 18 || // alt
			k == 91 || // left command
			k == 93 || // right command
			k == 16 //
		) {
			return false;
		}
		// backspace remove character
		if (k == 8) {
			console_value=console_value.slice(0, -1);
		}

		// enter
		if (k == 13) {
			console_value_to_user_answers();
		}

		// add space
		if (k == 32) {
			c = String.fromCharCode(k);
			console_value += c;
		}
		update_console_display();
	});
	$('body').keypress(function(e){
		var k = e.which;
		c = String.fromCharCode(k);
		console_value += c;
		update_console_display();
	});

	function update_console_display (){
		var console_html = '';
		if( _try_console_answer() ) {
			$('span#console-input').addClass('active');
		} else {
			$('span#console-input').removeClass('active');
		}
		var console_html = console_value.replace(/\s/g, '&nbsp;');
		$('span#console-input').html(console_html);

	}

	function update_box_display(){
		$('div#tv ul li').removeClass('wrong');
		for (var i in user_answers ) {
			var answer_display = ( user_answers[i] )?code_display_pair[user_answers[i]]:'';
			var answer_box = $('<div class="answer_box">'+answer_display+'</div>');
			$($('div#tv ul li')[i]).html(answer_box);
			if (quest_answers[i]!=user_answers[i]) {
				$($('div#tv ul li')[i]).addClass('wrong');
			}
		}
		$('div#tv ul li').removeClass('active');
		$($('div#tv ul li')[user_answers_index]).addClass('active');
	}

	function console_value_to_user_answers(){
		if (_try_console_answer()) {
			user_answers[user_answers_index] = console_value;
			console_value = '';

			if (!song_is_play) {
				_user_answers_index_next();
			}
		}
		update_box_display();
	}

	function _try_console_answer(){
		var codes = [];
		for (var code in code_display_pair ) {
			codes.push(code);
		}

		if ( $.inArray(console_value,codes) != -1 ){
			return true;
		}
		return false;
	}
	function _user_answers_index_next() {
		user_answers_index+=1;
		if(user_answers_index>$('div#tv ul li').length-1)
			user_answers_index = 0;
	}

}


function play_quest_answers( ) {

	var startTime = chord_sample.sample.context.currentTime;
	for (var i in quest_answers ) {
		var playtime = startTime+i*eighthNoteTime*8;
		chord_sample.play(quest_answers[i],playtime);
	}
}
function pause_quest_answers( ) {

}