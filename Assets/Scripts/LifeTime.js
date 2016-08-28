#pragma strict
public var delay:float = 10.0; //This implies a delay of 2 seconds.

function Start () {
	WaitAndDestroy();
}

function WaitAndDestroy(){
	yield WaitForSeconds(delay);
	Destroy (gameObject);
}