#pragma strict

// Rotation speed (degrees/sec)
var spinSpeed : int = 30;


var selected : int = 2;
enum Mode {_X, _Y, _Z}
var mode : Mode;

function Update () {


	if(mode == Mode._X){
		transform.Rotate(spinSpeed * Time.deltaTime, 0, 0);

	}
	if(mode == Mode._Y){
		transform.Rotate(0, spinSpeed * Time.deltaTime, 0);

	}
	if(mode == Mode._Z){
		transform.Rotate(0, 0, spinSpeed * Time.deltaTime);

	}


}
