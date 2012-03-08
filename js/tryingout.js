// used of closure
function a() {
	var x = 0;
	function b () {
		x = x + 1;
		console.log(x);
	};
	return {'b':b};
};
//a().b();
var c = a();
c.b();
c.b();

