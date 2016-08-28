#pragma strict
public static var Enemies = 1;
var EnemyType : GameObject[];
var spawnLoc : Transform[];
var spawnAmnt : int = 10;
private var timer : float = 0;
var respawnTime : float = 3.0;
var updateTimer : float = 0.5;
function LateUpdate () {
	if(timer > respawnTime){
		Spawner(EnemyType[0]);
		timer = 0;
	}
	else{
		timer += updateTimer;
	}
}


function Spawner(EnemyToSpawn){
	var clone : GameObject;
	if(Enemies <= spawnAmnt){
		for(var i : int = 0; i < spawnLoc.length; i++)
		{
			clone = Instantiate(EnemyToSpawn, spawnLoc[i].transform.position, transform.rotation);
		}
		Enemies += 1;
	}
}