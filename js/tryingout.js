// used of closure
function a() {
	var x = 0;
	function b () {
		x = x + 1;
		console.log(x);
	}
	return {'b':b};
}
//a().b();
//var c = a();
//c.b();
//c.b();

var wheel  = 4;
this.wheel = 4;
function car(wheel){
	this.wheel = wheel;
	this.getWheel = function(){
//		this.wheel = 3;
		return this.wheel;
	};
}

var myCar = new car('plastic');
var output = myCar.getWheel();
console.log( output );
