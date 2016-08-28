public var speed: float; 
var AnimControl : Animator;

function Update () {
	AnimControl.speed = 1/Time.timeScale;
}