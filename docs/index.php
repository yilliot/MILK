<html>
<head>
	<title>Keywords</title>
	<link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css">
</head>
<body>
<div class='container'>
	<h1>Keywords</h1>
	<section>
		<h2>Track</h2>
		<article>
			<p><span> Track </span> select <span>instrument</span> from (piano,synth,guitar,bass,string,chord).</p>
			<p><span> Init </span> function load audio sample with <span>callback parameter</span> use <span>sample_loader</span></p>
			<p><span> Volumn </span> is optional to adjust</p>
		</article>
	</section>
	<section>
		<h2>Slot</h2>
		<article>
			<p><span> Slot </span> describe the <span>bpm</span> and <span>time signature</span>.</p>
			<p><span> Direction </span> describe the next slot number by the <span>play_count</span></p>
			<p><span> Key </span> and <span> scale mode </span> is optional to adjust.</p>
			<p> Located in  <span> Track </span></p>
		</article>
	</section>
	<section>
		<h2>Bar</h2>
		<article>
			<p><span> Bar </span> is array created realtime, contain <span> Notes </span></p>
			<p> Located in  <span> Track </span></p>
		</article>
	</section>
	<section>
		<h2>Controller</h2>
		<article>
			<p><span> Controller </span> gather required elements and delegate their functions </p>
			<p><span> Controller </span> load <span>track</span>, <span>slot</span>, <span>notes</span> to <span>bar</span> </p>
			<p> Navigate from <span>slot</span> to <span>slot</span> and play the <span>notes</span> of the <span>bar</span> with <span>track</span> </p>
		</article>
	</section>	
</div>


</body>
</html>