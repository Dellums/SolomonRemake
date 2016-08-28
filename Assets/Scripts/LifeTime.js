#pragma strict
var delay:float = 10.0; //This implies a delay of 2 seconds.
var ball_Y : int = 2;
var lerpTime : float = 1.0;
var LerpEnable : boolean = true;
function Start () {
	WaitAndDestroy();
}

function Update(){
	if(LerpEnable){
		if (Mathf.Floor(transform.position.y) == ball_Y){
			GetComponent.<Rigidbody>().constraints = RigidbodyConstraints.FreezePositionY;
		}
		else{
			transform.position.y = Mathf.Lerp(transform.position.y, ball_Y, lerpTime*Time.deltaTime);
		}
	}
}

function WaitAndDestroy(){
	yield WaitForSeconds(delay);
	Destroy (gameObject);
}