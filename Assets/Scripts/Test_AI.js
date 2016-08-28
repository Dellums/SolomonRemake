var hitcount 		: int = 0;
var max_health 		: int = 50;
var m_Animator 		: Animator;
var speed 			: float = 3.0;
var line 			: LineRenderer; //to hold the line Renderer
var target 			: Transform; //to hold the transform of the target
var agent 			: NavMeshAgent; //to hold the agent of this gameObject
var LineDebug		: boolean = false;
var Damage			: float[];
var HPBar			: UI.Image;


function Start(){
	target = GameObject.FindWithTag("Player").transform;
    line = GetComponent(LineRenderer); //get the line renderer
    agent = GetComponent(NavMeshAgent); //get the agent
    getPath();
}

function Update(){
	var curHealth : float = ((max_health*1.0 - hitcount*1.0) / max_health*1.0);
	HPBar.fillAmount = curHealth;
	HPTrack();

	if(hitcount >= max_health){
		gameObject.tag="Dead";
		m_Animator.speed = 1.0;
		m_Animator.SetBool("Death", true);
		GetComponent.<Collider>().enabled = false;
		agent.Stop();
		killEnemy();
	}
}
function HPTrack(){
	var HPTracking = target.position - HPBar.transform.position;
	HPTracking.y = 0;
	var rotation = Quaternion.LookRotation(HPTracking);
	HPBar.transform.rotation = Quaternion.Slerp(HPBar.transform.rotation, rotation, Time.deltaTime * 10);

}


function LateUpdate(){
	getPath();

	if (agent.remainingDistance <= agent.stoppingDistance){
		if (!agent.hasPath || agent.velocity.sqrMagnitude == 0f)
		{
			var lookPos = target.position - transform.position;
			lookPos.y = 0;
			var rotation = Quaternion.LookRotation(lookPos);
			transform.rotation = Quaternion.Slerp(transform.rotation, rotation, Time.deltaTime * 10);
			m_Animator.SetBool("Moving", false);
			m_Animator.speed = 2.0;
		}
	}
	else{
		m_Animator.SetBool("Moving", true);
		m_Animator.speed = 1.0;
	}
}
function killEnemy(){
	yield WaitForSeconds(3);
	Destroy(this.gameObject);

}
function getPath(){
    line.SetPosition(0, transform.position); //set the line's origin

    agent.SetDestination(target.position); //create the path
    agent.speed = speed;
    yield WaitForEndOfFrame(); //wait for the path to generate
    DrawPath(agent.path);
    if(LineDebug){
    	line.enabled = true;
    }
    else{
    	line.enabled = false;
    }
}

function DrawPath(path : NavMeshPath){
    if(path.corners.Length < 2) //if the path has 1 or no corners, there is no need
        return;

    line.SetVertexCount(path.corners.Length); //set the array of positions to the amount of corners

    for(var i = 1; i < path.corners.Length; i++){
        line.SetPosition(i, path.corners[i]); //go through each corner and set that to the line renderer's position
    }
}

function OnTriggerEnter (other : Collider) {
	if(other.gameObject.tag == "Player_Spell"){
		hitcount += Damage[0];
		Destroy(other.gameObject);
	}
}

function OnTriggerStay(other : Collider){
	if(other.gameObject.tag == "Constant_Spell"){
		hitcount += Damage[1];
	}
}

function OnDestroy(){
	EnemySpawn.Enemies -= 1;
	playerInput.killedEnemies += 1;
}