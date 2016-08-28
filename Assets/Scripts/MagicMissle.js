#pragma strict
var multiplier :float = 10;
public var speedVal :float = 10;
var SpeedLimit = 20;
var delay:float = .5;
var target:Transform;
var destination: Vector3;
var agent: NavMeshAgent;
var forceBlast:GameObject;
enum MagicMissleNavigation {_Force, _navMesh}
var magicMissleNavigation : MagicMissleNavigation;

function Start() {
	playerInput.MagicMissleCount += 1;
	target = FindClosestEnemy();
	agent = GetComponent.<NavMeshAgent>();
	destination = agent.destination;
	WaitAndtoTrack();
}

function Update() {
	if(!target){
		target = FindClosestEnemy();
	}
	if(target.gameObject.tag == "Dead"){
		target = FindClosestEnemy();
	}
	if(target.gameObject.name == ".enemy"){
		target = FindClosestEnemy();
	}

	transform.LookAt(target.position);
	WaitAndtoTrack();
}

function FindClosestEnemy () : Transform {
	// Find all game objects with tag Enemy
	var gos : GameObject[];
	gos = GameObject.FindGameObjectsWithTag("enemy"); 

	var closest : Transform; 
	var distance = Mathf.Infinity; 
	var position = transform.position; 
	// Iterate through them and find the closest one
	for (var go : GameObject in gos)  { 
		var diff = (go.transform.position - position);
		var curDistance = diff.sqrMagnitude; 
		if (curDistance < distance) { 
			closest = go.transform; 
			distance = curDistance; 
		} 
	} 
	try {
		return closest.transform;	
	}
	catch (err) {
		print(err.Message);
	}

}

function WaitAndtoTrack(){
	// yield WaitForSeconds(delay);
	// Update destination if the target moves one unit
	
	if(magicMissleNavigation == magicMissleNavigation._Force){
		agent.enabled = false;
		
		GetComponent.<Rigidbody>().velocity = Mathf.Clamp (GetComponent.<Rigidbody>().velocity.magnitude, 0, SpeedLimit) * GetComponent.<Rigidbody>().velocity.normalized;
		if (target.transform.position != this.transform.position){
			transform.LookAt(target);
			this.GetComponent.<Rigidbody>().AddForce(this.transform.forward * speedVal*multiplier);
		}
	}
	if(magicMissleNavigation == magicMissleNavigation._navMesh){
		GetComponent.<Rigidbody>().isKinematic = true;
		if (Vector3.Distance(destination, target.transform.position) > 1.0f) {
			destination = target.transform.position;
			agent.destination = destination;
		}
	}


	delay = 0;
}

function OnDestroy () {
	var clone : GameObject;
	playerInput.MagicMissleCount -= 1;
	clone = Instantiate(forceBlast, transform.position, transform.rotation);
}