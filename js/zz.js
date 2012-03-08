// jQuery Extension
/**
 * js core prototyping
 **/


jQuery.extend({
	postJSON: function( url, data, callback) {
		return jQuery.post(url, data, callback, "json");
	}
});

// zz convienient function collection
window.zz = {
	'String':{
		'repeat':function(str,num){
		    return new Array(isNaN(num)? 1 : ++num).join(str);
		}
	},
	'Array':{
		'permute':function(v,m) {
			for(var p = -1, j, k, f, r, l = v.length, q = 1, i = l + 1; --i; q *= i);
			for(x = [new Array(l), new Array(l), new Array(l), new Array(l)], j = q, k = l + 1, i = -1;
				++i < l; x[2][i] = i, x[1][i] = x[0][i] = j /= --k);
			for(r = new Array(q); ++p < q;)
				for(r[p] = new Array(l), i = -1; ++i < l; !--x[1][i] && (x[1][i] = x[0][i],
					x[2][i] = (x[2][i] + 1) % l), r[p][i] = m ? x[3][i] : v[x[3][i]])
					for(x[3][i] = x[2][i], f = 0; !f; f = !f)
						for(j = i; j; x[3][--j] == x[2][i] && (x[3][i] = x[2][i] = (x[2][i] + 1) % l, f = 1));
			return r;
		}
	},
	'trim' : function( a ) { return a.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); },
	'isNumeric' : function(n) { return !isNaN(parseFloat(n)) && isFinite(n); },
	'dom' : function( tag , html , attr ) { 
		var attr = attr || ''; return '<'+tag+' '+attr+'>'+html+'</'+tag+'>'; },
	'dom2' : function ( tag , attr ) { 
		var attr = attr || ''; return '<'+tag+' '+attr+' />'; },
	'urlgup' : function( name ) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexStr = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexStr );
		var results = regex.exec( window.location.href );
		return (results!=null)?results[1] : null;
	},
	'urlgupreplace' : function(json,url){
		
		var url = url || document.location.href;
		
		for (var name in json ) {
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexStr = "([\\?&])"+name+"=([^&#]*)";
			var regex = new RegExp( regexStr );
			var results = regex.exec( url );
			if (results===null) {
				var temparr = [];
				temparr[name]=json[name];
				url = zz.urlgupadd(temparr,url);
			} else {
				url = url.replace( regex , results[1]+name+'='+json[name] );
			}

		};
		return url;
	},
	'urlgupadd' : function(json,url){
		
		var url = url || document.location.href;
		var key = (url.split('?').length == 1 ) ? '?' : '&';
		for (var name in json ) {
			url = url + key + name + '=' + json[name];
			key = '&';
		};
		return url;
	}
};

function initFunctional () {

	$( '.autofocus' ).focus();
	
	$( '.clicktohide' ).click(function(){$( this ).fadeOut('fast');});
	$( '.clicktohideparent' ).click(function(){$( this ).parent().fadeOut('fast');});
	
	$( '.clicktoexpand' ).click(function(e){
		$( this ).find('.expandable').slideToggle('fast');
	});
	$( '.clicktoexpandnext' ).click(function(e){
		$( this ).next('.expandable').slideToggle('fast');
	});
	
	$( '.hovertoshow' ).hover(
		function ( ) {
			$( this ).find('.showable').stop().fadeIn();
		},function ( ) {
			$( this ).find('.showable').stop().fadeOut();
		}
	);
	
	$( 'button.reset' ).click(function(){
		var bt = $( this );
		if ( $( this ).closest('form').length )
			$( this ).closest('form').get(0).reset();
		if ( bt.attr('href') )
			location.href=bt.attr('href');
		return false;
	});
	
	$( 'th.sortable' ).each(function(e){
		var target = $( this );
		var old_sortdir = '';
		var sorturl = zz.urlgupreplace({'sortcol':target.attr('col'),'sortdir':'desc'});
		var sortdir = 'desc';
		
		// condition
		var col = zz.urlgup('sortcol');
		if (col!==null) { // has sort column
			if (target.attr('col')==col) { // is this column
				old_sortdir = zz.urlgup('sortdir');
				sortdir = ( old_sortdir == 'desc' ) ? 'asc' : 'desc';
				sorturl = zz.urlgupreplace({'sortdir':sortdir});
			};
		};
		// display
		target.html( zz.dom('span',target.html()) + zz.dom('span','','class="icon"') )
			.css('cursor','pointer')
			.removeClass('asc').removeClass('desc').addClass(old_sortdir)
			.attr('href',sorturl);

		// event
		target.click(function(e){
			window.location = target.attr('href');
		});
	});
}

function initValidate () {

	$( 'input.digit' ).keypress(function( e ){
		if ( e.which!=8 && e.which!=0 && (e.which<44 || e.which==47 || e.which>57) ) { 
			return false; 
		}
		var postValue = parseFloat( $( this ).val()+''+String.fromCharCode(e.which) );
		if ( e.which!=8 && e.which!=0 && postValue > parseInt($( this ).attr('max')) ) {
			return false;
		}
	});
	$( 'input.length' ).keypress(function( e ){
		if ( e.which!=8 && e.which!=0 && $( this ).val().length >= $( this ).attr('max') && e.which != 8 ) {
			return false;
		}
	});
	$('.clickfalse').click(function(e){ return false; });
	$('.enterfalse').keypress(function( e ){ return e.which != 13; });
}

function initPlugins () {
	
	if ( jQuery.isFunction(jQuery.datepicker) ) {
		$( '.datepicker' ).datepicker({
			dateFormat: 'yy-mm-dd',
			changeYear:true,changeMonth:true,
			showOn:"button",
			buttonImage:"img/icons/date.png",buttonImageOnly:true,
			yearRange:'c-100:c+10'
		});
	};
	
	if ( jQuery.isFunction(jQuery.tabs) ) {
		$( '.tabs' ).tabs();
	}
	if ( jQuery.isFunction(jQuery.colorbox) ) {
		$(".colorbox").colorbox();
		$(".colorboxopen").colorbox({'open':true});
	}
}


// window load
$( window ).load(function ( ) {
	$('#loadingWrapper').hide();
});

// document ready
$(function(){
	initFunctional();
	initValidate()
	initPlugins();
});
