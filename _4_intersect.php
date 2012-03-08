<!DOCTYPE html5>
<html>
<head>
	<title>Note Graph</title>
	<script src='../js/jquery-1.7.1.min.js' type='text/javascript' charset="utf-8"></script>
	<script src="../js/zz.js" type="text/javascript" charset="utf-8"></script>
	<script src="../js/audiolib.js" type="text/javascript" ></script>
	<script src="../js/milk.mx.js" type="text/javascript" charset="utf-8"></script>
	<style type="text/css" media="screen">
		.clear{clear:both;}
	</style>
	<script type="text/javascript">
	var collection = {}; // 204
	
	$(function(){
		generateCollection();
		//var contact = matchNotes(collection['C_maj']);
		//console.log(Obj.size(contact));
		
		// create input component
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
		
		$('#search').click(function(e){
			var target = $( this );
			var key = MX.Note.toPlain($('#rootNote').val())+'_'+$('#chordType').val();
			var stat = matchNotes(collection[key]);
			var html = '';
			for (var i in stat ) {
				if (Obj.size(stat[i])!=0) {
					html += '<tr><td>'+i+'</td><td>'+Obj.join(stat[i],', ')+'</td></tr>';
				};
			};
			$('table ').html(html);
		});
	});
	
	// search a chord's notes from whole collection
	function matchNotes (targetChord) {
		var contact = {};
		var stat = {1:{},2:{},3:{},4:{},5:{},6:{}};
		for (var i in targetChord ) {
			for (var chordType in collection ) {
				for (var k in collection[chordType] ) {
					if (collection[chordType][k] == targetChord[i]) {
						if(typeof(contact[chordType])=='undefined') contact[chordType] = {'note':{},'count':0};
						contact[chordType]['note'][Obj.size(contact[chordType]['note'])] = targetChord[i];
						contact[chordType].count++;
						contact[chordType].match = contact[chordType].count/Obj.size(collection[chordType]);
					};
				};
			};
		};
		for (var i in contact ) {
			stat[contact[i].count][Obj.size(stat[contact[i].count])] = i;
		};
		return stat;
	}
	
	function generateCollection () {
		// from C4 - B4
		for (var i = 48	; i <= 59; i++){

			var root = MX.Note.byBase(i);
			
			// loop chord types
			for (var j in MX.Chord.mapIntervalToChord ) {
				
				collection[MX.Note.toPlain(root)+'_'+j] = chordToSimpleNote(root,MX.Chord.mapIntervalToChord[j]);
			};
		};
		
		var htmllist = '';
		for (var i in collection ) {
		//	htmllist += ''+i+' '+Obj.join(collection[i],',')+'<br/>';
		};
	}
	
	// make C4:root + 7:chordType = return C E G Bb:array
	function chordToSimpleNote (rootName,chordType) {
		var notes = {0:MX.Note.toPlain(rootName)};
		// create notes by root and chord
		for (var k in chordType ) {
			var note = MX.Interval.toNote( rootName , chordType[k] );
			var base = MX.Note.toBase(note);
			var similarNote = MX.Note.byBase(base);
			var plain = MX.Note.toPlain(similarNote);
			notes[Obj.size(notes)] = plain;
		};
		return notes;
	}
	</script>
</head>
<body>
	<select id="rootNote">
	</select><!-- rootNote -->
	<select id="chordType">
	</select><!-- chordType -->
	<button id='search'> Search </button>
	<table class="">
		
	</table>
</body>
</html>